export const transformCorrectedAttendanceToUI = (apiData: any[]) => {
  return apiData.map(item => ({
    id: `REQ${item.corrected_attendance_id}`,
    attendanceId: `ATT${item.attendance_id || 'NEW'}`,
    employeeId: item.employee_code,
    employeeName: `${item.first_name} ${item.last_name}`,
    date: item.attendance_date,
    currentCheckIn: item.original_check_in || 'Not recorded',
    currentCheckOut: item.original_check_out || 'Not recorded',
    requestedCheckIn: item.check_in,
    requestedCheckOut: item.check_out,
    reason: item.reason,
    status: item.status,
    type: item.source === 'manual' ? 'Manual Entry' : 'System Correction',
    submittedAt: item.created_at,
    reviewedBy: item.approved_by?.toString(),
    reviewedAt: item.approved_at,
    reviewNotes: item.actions?.review_notes,
    supportingDocuments: item.attachments || []
  }));
};

export const formatTimeForAPI = (time: string) => {
  // Convert HH:mm AM/PM to 24-hour format if needed
  if (time.includes('AM') || time.includes('PM')) {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  return time;
};