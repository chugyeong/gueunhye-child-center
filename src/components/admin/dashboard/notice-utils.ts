export function compareNoticeDateDesc(left: { createdAt: string }, right: { createdAt: string }) {
  return parseNoticeDate(right.createdAt) - parseNoticeDate(left.createdAt);
}

function parseNoticeDate(date: string) {
  return new Date(date.replaceAll(".", "-")).getTime();
}
