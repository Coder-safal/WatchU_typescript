class TimeUtils {
  parseDate = (date: string): number => {
    const [day, month, year] = date.split("/").map(Number);

    const dateObj = new Date(year, month - 1, day);
    return dateObj.getTime(); //convert into miliseconds
  };

  formatDate = (milliseconds: number): string => {
    const dateObj = new Date(milliseconds);

    return dateObj.toLocaleDateString("en-GB"); // "en-GB" gives DD/MM/YYYY format
  };
}

export default new TimeUtils();
