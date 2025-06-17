// utils/textExtractors.ts

/**
 * Extracts a school name from a location string.
 * Looks for patterns like "School of Xyz" or "Xyz College".
 * @param location - The location string of the printer.
 * @returns The extracted school name or "Uncategorized School".
 */
export const getSchoolFromLocation = (location: string = "Unknown Location"): string => {
  if (!location || location === "Unknown Location") {
    return "Uncategorized School";
  }

  // Attempt to match "School of <Name>" or "<Name> School" or "<Name> College" not within parentheses
  // Prioritize "School of" and "College of"
  let schoolMatch = location.match(/\bSchool of ([^()]+)/i);
  if (schoolMatch && schoolMatch[1]) {
    return `School of ${schoolMatch[1].trim()}`;
  }

  schoolMatch = location.match(/\bCollege of ([^()]+)/i);
  if (schoolMatch && schoolMatch[1]) {
    return `College of ${schoolMatch[1].trim()}`;
  }
  
  // Broader match for "Name School" or "Name College" or things that are "XYZ College/School"
  // This tries to find a segment that contains "School" or "College" but is not just a room name.
  // Example: "Block 3 Level 8 College Administration Services (CAS)" -> "College Administration Services"
  schoolMatch = location.match(/([^,(]+(?:School|College)[^,(]*)/i);
   if (schoolMatch && schoolMatch[1]) {
    // Avoid very short matches that might just be part of a word or acronym like "Schoolroom"
    const potentialSchool = schoolMatch[1].trim();
    if (potentialSchool.length > 5) { // Arbitrary length to avoid overly generic matches
        // Further clean up if it's part of a larger string but not well-defined
        // For "Block X Level Y School of Z", previous regex handles it.
        // For "Block X Level Y Some College Name", this should pick "Some College Name"
        if (!potentialSchool.toLowerCase().startsWith("block") && !potentialSchool.toLowerCase().startsWith("level")) {
            return potentialSchool;
        }
    }
  }
  
  // If specific school name structures aren't found but keywords exist.
  if (location.toLowerCase().includes("school") || location.toLowerCase().includes("college")) {
    // Try to extract a reasonable segment if keyword found but not specific pattern.
    // This is a more general attempt. Might return the full location if too complex.
    const parts = location.split(/[,(]/); // Split by comma or parenthesis
    for (const part of parts) {
        if (part.toLowerCase().includes("school") || part.toLowerCase().includes("college")) {
            const trimmedPart = part.trim();
            if (trimmedPart.length > 5) return trimmedPart; // Basic filter
        }
    }
  }

  return "Uncategorized School";
};

/**
 * Extracts a department name from a location string.
 * Typically looks for content within the last set of parentheses.
 * @param location - The location string of the printer.
 * @returns The extracted department name or "Uncategorized Department".
 */
export const getDepartmentFromLocation = (location: string = "Unknown Location"): string => {
  if (!location || location === "Unknown Location") {
    return "Uncategorized Department";
  }
  // Matches content within the last parentheses in the string.
  // Example: "Location (Dept)" -> "Dept"
  // Example: "Location (Building B) (Dept C)" -> "Dept C"
  const deptMatch = location.match(/\(([^)]+)\)[^()]*$/);
  if (deptMatch && deptMatch[1]) {
    return deptMatch[1].trim();
  }
  return "Uncategorized Department";
};
