export function generateInitials(fullName) {
    if (!fullName) return ''; // Handle empty input
  
    const words = fullName.trim().split(' ');
  
    // Handle single-word names (e.g., "Cher")
    if (words.length === 1) return words[0][0].toUpperCase();
  
    const firstInitial = words[0][0].toUpperCase();
    const lastInitial = words[words.length - 1][0].toUpperCase();
  
    return firstInitial + lastInitial;
  }
  
  