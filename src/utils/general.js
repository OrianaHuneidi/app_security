
export const capitalizeFullName = (fullName) => {
  return fullName
    .split(' ')
    .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    .join(' ');
}