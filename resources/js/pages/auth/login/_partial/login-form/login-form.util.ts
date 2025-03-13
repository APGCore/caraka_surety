export const greetingBasedOnDate = () => {
  const date = new Date();
  const hour = date.getHours();
  let subtitle;

  if (hour < 12) {
    subtitle = "Good Morning";
  } else if (hour < 18) {
    subtitle = "Good Afternoon";
  } else {
    subtitle = "Good Night";
  }

  return subtitle;
};
