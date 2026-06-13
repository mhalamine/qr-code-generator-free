export function generateVCard({ firstName, lastName, phone, email, company, jobTitle, website, address }) {
  const parts = ['BEGIN:VCARD', 'VERSION:3.0'];
  
  const fName = (firstName || '').trim();
  const lName = (lastName || '').trim();
  
  if (lName || fName) {
    parts.push(`N:${lName};${fName};;;`);
    parts.push(`FN:${fName} ${lName}`.trim());
  }
  
  if (company) parts.push(`ORG:${company.trim()}`);
  if (jobTitle) parts.push(`TITLE:${jobTitle.trim()}`);
  if (phone) parts.push(`TEL;TYPE=CELL:${phone.trim()}`);
  if (email) parts.push(`EMAIL;TYPE=INTERNET:${email.trim()}`);
  if (website) parts.push(`URL:${website.trim()}`);
  if (address) parts.push(`ADR;TYPE=WORK:;;${address.trim()};;;;`);
  
  parts.push('END:VCARD');
  return parts.join('\n');
}
