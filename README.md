
# Transition Plan: Migrating Printer Meter Tracker to DuckDB-WASM

## 1. Introduction and Goal

**Current State:** The Printer Meter Tracker application currently stores all printer and meter reading data in the browser's `localStorage`, serializing JavaScript objects to JSON strings. Data manipulation, filtering, and aggregation are performed using JavaScript array methods.

**Motivation for Migration:** As the volume of printer data (especially historical meter readings) grows, `localStorage` (with its typical 5-10MB limit) and in-memory JavaScript processing can become bottlenecks, leading to:
*   Performance degradation during data loading and complex filtering.
*   Risk of exceeding `localStorage` quotas.
*   Limited querying capabilities compared to SQL.

**Goal:** To enhance the application's scalability, performance with large datasets, and querying power by migrating the data storage and processing layer to DuckDB-WASM. DuckDB will run in the browser, using IndexedDB for persistent storage of the database file.

## 2. Why DuckDB-WASM?

DuckDB-WASM offers several advantages for this application:
*   **In-Browser SQL Database:** Enables complex SQL queries (joins, aggregations, window functions) directly on the client-side.
*   **Analytical Performance:** DuckDB is optimized for analytical workloads and can efficiently handle larger datasets.
*   **WASM Efficiency:** WebAssembly allows near-native performance for database operations.
*   **Reduced Main Thread Work:** For complex operations, DuckDB can perform work off the main thread if using its worker-based API, improving UI responsiveness.
*   **Data Integrity:** SQL schemas enforce data types and relationships.

## 3. Key Architectural Changes

The transition will involve fundamental changes:

*   **Data Storage:**
    *   **Current:** `localStorage` (JSON strings).
    *   **New:** DuckDB (in-memory, WASM) with the database file persisted in **IndexedDB**.
*   **Data Model:**
    *   **Current:** JavaScript `Printer` and `MeterReading` objects/interfaces.
    *   **New:** SQL tables (e.g., `printers`, `meter_readings`) with defined schemas.
*   **Data Querying & Manipulation:**
    *   **Current:** JavaScript array methods (`.filter`, `.map`, `.sort`, etc.) and utility functions.
    *   **New:** SQL queries executed via the DuckDB-WASM API.
*   **Data Ingestion:**
    *   `initialData.ts` parsing logic will be adapted to load data into SQL tables using `INSERT` statements or bulk loading methods.
*   **State Management:**
    *   React state will need to manage asynchronous database operations (loading, querying, saving). UI will need to handle loading states.

## 4. Step-by-Step Transition Plan

This migration will be approached in phases to manage complexity.

### Phase 1: Setup and Basic DuckDB Integration

*   **Step 1.1: Install DuckDB-WASM**
    *   Add the `@duckdb/duckdb-wasm` package to the project: `npm install @duckdb/duckdb-wasm`.
*   **Step 1.2: Configure WASM Asset Serving**
    *   Ensure DuckDB WASM worker files (`.wasm`, `.worker.js`) are correctly served. For a Vite-based setup (if applicable later, or for local dev server), these might go in the `public` directory or require specific bundler configuration.
*   **Step 1.3: Create a DuckDB Service/Module (e.g., `services/duckdbService.ts`)**
    *   Encapsulate DuckDB initialization logic (asynchronous).
    *   Define functions to connect to/create the database instance.
    *   Define functions to create the SQL schema (tables `printers`, `meter_readings`) if they don't exist.
*   **Step 1.4: Basic Data Ingestion from `initialData.ts`**
    *   Modify parsers in `initialData.ts` to transform CSV/OCR data into structures suitable for SQL insertion (e.g., arrays of objects for `insertJSON`, or directly generate `INSERT` statements).
    *   On application startup, after DuckDB initialization, load the `initialPrinters` data into the DuckDB tables.
    *   Focus on getting the data into DuckDB without initially worrying about persistence.

### Phase 2: Persistence with IndexedDB and Basic Data Reading

*   **Step 2.1: Implement IndexedDB Persistence for DuckDB File**
    *   In `duckdbService.ts`:
        *   Function to export the current DuckDB database state to a file/blob (`db.exportFile()`).
        *   Function to save this blob to IndexedDB (e.g., using a library like `idb` or raw IndexedDB API).
        *   Function to load the database blob from IndexedDB on startup.
        *   If loaded, initialize DuckDB with this file; otherwise, create a new DB and populate from `initialData.ts`.
*   **Step 2.2: Basic Read Operations**
    *   Replace the `useLocalStorage('printers', initialPrinters)` hook in `App.tsx`.
    *   Instead, on app mount, trigger an asynchronous fetch from `duckdbService.ts` to get all printers.
    *   The `printersData` state in `App.tsx` will be populated from DuckDB query results.
    *   Adapt a small, simple part of the UI (e.g., a basic printer count or list) to display data fetched from DuckDB.

### Phase 3: Migrating Query Logic and UI Components

*   **Step 3.1: Convert Global Filters and `globallyFilteredPrinters`**
    *   Translate the JavaScript filtering logic in `App.tsx` (date range, serial, name, model) into dynamic SQL `WHERE` clauses.
    *   Status calculation (`getPrinterStatus`) will need to be re-evaluated:
        *   Reading filtering by date will be done in SQL.
        *   Complex status logic might remain in JavaScript, operating on SQL query results, or be translated to SQL if feasible.
    *   Update `GlobalFilters.tsx` to trigger SQL queries (via `App.tsx` or the service) and update the main `printersData` state.
*   **Step 3.2: Update Dashboard Components (`SummaryView`, `AnalyticsDashboard`, `PrinterList`)**
    *   `SummaryView`: Statistics (total devices, page counts, costs, status counts) will be calculated using SQL aggregation functions (`COUNT(*)`, `SUM()`, `AVG()`, `GROUP BY`) on the filtered dataset.
    *   `AnalyticsDashboard`: Data for charts (monthly costs, cost distribution, usage trends) will be generated by SQL queries.
    *   `PrinterList`: Will display data directly from the (filtered and sorted by SQL) `printersData` state. Grouping logic might use SQL `ORDER BY` or client-side grouping on query results.
*   **Step 3.3: Update Specific Views (`KyoceraFleetView`, `MaintenanceAlertsView`, etc.)**
    *   `KyoceraFleetView`:
        *   Its "Kyocera model" specific filter becomes part of its main SQL query.
        *   Sorting by columns (Serial #, Name, etc.) will be handled by SQL `ORDER BY` clauses.
        *   Row selection logic remains client-side.
    *   `MaintenanceAlertsView`, `MisidentifiedPrintersView`: SQL queries will select relevant printers based on their specific criteria, operating on the globally filtered view of data.

### Phase 4: Data Modification Operations

*   **Step 4.1: Convert `LogReadingForm.tsx`**
    *   On form submission, execute an SQL `INSERT` statement into the `meter_readings` table via `duckdbService.ts`.
    *   After successful insertion, trigger a re-fetch of affected data or update the local React state mirroring the DB.
    *   Ensure the DuckDB database is re-exported and saved to IndexedDB.
*   **Step 4.2: Convert `AddPrinterForm.tsx`**
    *   On form submission, execute SQL `INSERT` into the `printers` table (and potentially `meter_readings` for an initial reading).
    *   Trigger data re-fetch/update and persistence to IndexedDB.

### Phase 5: Refinement, Error Handling, and Optimization

*   **Step 5.1: Robust Asynchronous State Management**
    *   Implement loading indicators in the UI for all asynchronous database operations.
    *   Gracefully handle UI updates based on query results or errors.
*   **Step 5.2: Comprehensive Error Handling**
    *   Implement error handling for DuckDB initialization, query execution, and IndexedDB operations.
    *   Provide user feedback for critical errors (e.g., DB failing to load).
*   **Step 5.3: Performance Tuning and Optimization**
    *   Analyze SQL query performance.
    *   Add SQL indexes to frequently queried columns (e.g., `printers.id`, `printers.model`, `meter_readings.printer_id`, `meter_readings.date`).
    *   Optimize data loading sequences and minimize unnecessary re-renders.
*   **Step 5.4: User Experience for Persistence**
    *   Consider UI elements to indicate data saving status or last saved time.
    *   Implement manual "Export Database" and "Import Database" features for user backups, using the DuckDB file exported/imported from IndexedDB.
*   **Step 5.5: Data Migration for Existing Users (If Deployed with localStorage data)**
    *   Develop a one-time migration script:
        *   On first load after the update, check if `localStorage` data exists.
        *   If yes, parse it, transform it into the SQL schema structure.
        *   Insert this data into DuckDB.
        *   Save the new DuckDB database to IndexedDB.
        *   Clear or mark the old `localStorage` data as migrated.

## 5. Data Model (Example SQL Schema)

```sql
CREATE TABLE IF NOT EXISTS printers (
    id VARCHAR PRIMARY KEY, -- Serial Number
    name VARCHAR,
    model VARCHAR,
    type VARCHAR, -- 'Black and White' or 'Full Colour'
    ipAddress VARCHAR,
    location VARCHAR,
    installationDate DATE, -- Store as YYYY-MM-DD
    bwRate DECIMAL(10, 4),
    fcRate DECIMAL(10, 4)
);

CREATE TABLE IF NOT EXISTS meter_readings (
    id VARCHAR PRIMARY KEY, -- UUID
    printer_id VARCHAR,
    date TIMESTAMP, -- Store as full timestamp for precision
    reading BIGINT,
    notes VARCHAR,
    FOREIGN KEY (printer_id) REFERENCES printers(id) ON DELETE CASCADE
);

-- Example Indexes:
CREATE INDEX IF NOT EXISTS idx_printers_model ON printers (model);
CREATE INDEX IF NOT EXISTS idx_meter_readings_printer_id ON meter_readings (printer_id);
CREATE INDEX IF NOT EXISTS idx_meter_readings_date ON meter_readings (date);
```

## 6. Challenges and Considerations

*   **Increased Complexity:** Managing SQL, WASM lifecycle, IndexedDB interactions, and asynchronous operations significantly increases application complexity.
*   **Bundle Size:** The DuckDB-WASM library and worker files will add to the initial application download size.
*   **Asynchronous Programming:** Requires careful handling of promises and state updates in React.
*   **Browser Compatibility:** Ensure target browsers support WebAssembly and IndexedDB robustly.
*   **Data Backup & Sync:** With GitHub Pages, data remains client-side. Emphasize the need for user-initiated export/import for backups or moving data between browsers/devices.
*   **Schema Migrations:** If the SQL schema evolves, a mechanism for migrating user data in IndexedDB will be needed.
*   **Debugging:** Debugging WASM and IndexedDB issues can be more involved.

## 7. Testing Strategy

*   **Unit Tests:** For `duckdbService.ts` functions (query construction, DB interactions), data transformation logic.
*   **Integration Tests:** Test the flow from UI interactions -> service calls -> DuckDB operations -> IndexedDB persistence -> UI updates.
*   **End-to-End Tests:** For critical user workflows like adding a printer, logging readings, filtering data, and viewing history.
*   **Migration Test:** Thoroughly test the one-time data migration script from `localStorage` to DuckDB/IndexedDB.

This plan provides a roadmap for transitioning the Printer Meter Tracker to a more scalable and powerful client-side architecture using DuckDB-WASM. Each phase should be implemented iteratively, with thorough testing.
      