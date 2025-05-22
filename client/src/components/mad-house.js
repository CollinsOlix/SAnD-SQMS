function initializeMonth(year, month) {
  let weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let monthDays = {};

  let numberOfDays = new Date(year, month + 1, 0);
  let dayOne = new Date(year, month, 1);
  dayOne = dayOne.toLocaleDateString("en-US", { weekday: "short" });
  numberOfDays = numberOfDays.getDate();

  //
  //
  let newWeekDays = weekDays.splice(
    0,
    weekDays.findIndex((i) => i === dayOne)
  );
  weekDays = weekDays.concat(newWeekDays);
  let i = 0,
    j = 0;
  while (i < numberOfDays) {
    monthDays[`${i + 1} ${weekDays[j]}`] = 0;
    if (j == 6) {
      j = 0;
      i++;
      continue;
    }
    i++;
    j++;
  }
  return monthDays;
}

console.log(initializeMonth(new Date().getFullYear(), new Date().getMonth()));
