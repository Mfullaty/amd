export function timeAgo(timestamp) {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const secondsPast = (now.getTime() - createdAt.getTime()) / 1000;

  if (secondsPast < 60) {
    return parseInt(secondsPast) + ' seconds ago';
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + ' minutes ago';
  }
  if (secondsPast < 86400) {
    return parseInt(secondsPast / 3600) + ' hours ago';
  }
  if (secondsPast < 2592000) {
    return parseInt(secondsPast / 86400) + ' days ago';
  }
  if (secondsPast < 31536000) {
    return parseInt(secondsPast / 2592000) + ' months ago';
  }

  return parseInt(secondsPast / 31536000) + ' years ago';
}
