export const formatDateTime = (timestamp: string) => {
  let formatted = ""
  const date = new Date(timestamp.replace(" ", "T"));

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    formatted = date
      .toLocaleString("en-US", options)
      .replace(" at ", " ")
      .replace(",", "")
      .replace("AM", "am")
      .replace("PM", "pm");

      return formatted
}

export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp.replace(" ", "T"));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp.replace(" ", "T"));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace("AM", "am").replace("PM", "pm");
};

export const timeAgo = (dateString: string) => {
  const createdAt = new Date(dateString.replace(" ", "T")); // ensure valid ISO format
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds} sec${seconds === 1 ? "" : "s"} ago`;
    if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    return `${days} day${days === 1 ? "" : "s"} ago`;
}

export const isWithinADay = (timestamp?: string) => {
  if (!timestamp) return false;

  const date = new Date(timestamp.replace(" ", "T"));
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  return diffInHours <= 24;
};