import React, { useState } from 'react';
import { format, addDays, isBefore } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  minDate = new Date()
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(value);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    // Preserve the time from selectedDate
    const newDate = new Date(date);
    newDate.setHours(selectedDate.getHours());
    newDate.setMinutes(selectedDate.getMinutes());
    
    setSelectedDate(newDate);
    onChange(newDate);
    setShowCalendar(false);
  };

  const handleTimeChange = (type: 'hour' | 'minute' | 'period', value: string) => {
    const newDate = new Date(selectedDate);
    const currentHours = newDate.getHours();
    const currentMinutes = newDate.getMinutes();
    const isPM = currentHours >= 12;

    if (type === 'hour') {
      let hour = parseInt(value);
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      newDate.setHours(hour);
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value));
    } else if (type === 'period') {
      const hour = currentHours % 12;
      newDate.setHours(value === 'PM' ? hour + 12 : hour);
    }

    onChange(newDate);
    setSelectedDate(newDate);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return {
      hour: hour12.toString(),
      minute: minutes.toString().padStart(2, '0'),
      period
    };
  };

  const { hour, minute, period } = formatTime(selectedDate);

  const disabledDays = [
    { before: minDate },
    { after: addDays(minDate, 30) } // Limit to 30 days in future
  ];

  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-900">{format(selectedDate, 'MMM d, yyyy')}</span>
        </button>

        {showCalendar && (
          <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              disabled={disabledDays}
              modifiersClassNames={{
                selected: 'bg-blue-500 text-white',
                today: 'font-bold',
                disabled: 'text-gray-400'
              }}
              styles={{
                caption: { color: '#1f2937' },
                head_cell: { color: '#6b7280' },
                day: { color: '#1f2937' }
              }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-gray-400" />
        <select
          value={hour}
          onChange={(e) => handleTimeChange('hour', e.target.value)}
          className="form-select w-16 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <span className="text-gray-600">:</span>
        <select
          value={minute}
          onChange={(e) => handleTimeChange('minute', e.target.value)}
          className="form-select w-16 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        >
          {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={period}
          onChange={(e) => handleTimeChange('period', e.target.value)}
          className="form-select w-20 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default DateTimePicker;
