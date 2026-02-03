export const formatDateTime = (dateString) => {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleString("en-IN", options);
};


export const formatDateOrTime = (timestamp) => {
  const emailDate = new Date(timestamp);
  const now = new Date();

  const diffMs = now - emailDate;
  const isWithin24Hours = diffMs < 24 * 60 * 60 * 1000;

  if (isWithin24Hours) {
    // Show time like 11:15 AM
    return emailDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else {
    // Show date like 15/02/2022
    return emailDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
  }
};

export const formatDateAndTime = (timestamp) => {
  const emailDate = new Date(timestamp);

  return emailDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) + " " + emailDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
