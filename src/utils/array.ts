export function flatten<T>(nestedArray: T[][]): T[] {
    if (nestedArray.length === 0) {
        return [];
    } else {
        return nestedArray.reduce((a, b) => a.concat(b));
    }
}

// Removes duplicate items from an array
export function distinct<T>(items: T[]): T[] {
    return Array.from(new Set(items));
}
