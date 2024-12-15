import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Stack, Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

interface DateTimeSelectionProps {
    onDateTimeChange: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
    initialStartDate?: Dayjs;
    initialEndDate?: Dayjs;
}

export default function DateTime({
    onDateTimeChange,
    initialStartDate = dayjs(),
    initialEndDate = dayjs().add(1, 'hour')
}: DateTimeSelectionProps) {

    const [startDateTime, setStartDateTime] = useState<Dayjs | null>(initialStartDate);
    const [endDateTime, setEndDateTime] = useState<Dayjs | null>(initialEndDate);

    useEffect(()=>{
        onDateTimeChange(startDateTime,endDateTime);
    },[startDateTime,endDateTime,onDateTimeChange])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    <DateTimePicker
                        value={startDateTime}
                        onChange={(newValue)=>setStartDateTime(newValue)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                helperText: 'Select start date',
                                sx: {
                                    '& .MuiInputBase-input': {
                                        fontSize: '0.8rem',
                                        padding: '8px',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        fontSize: '0.75rem',
                                        marginTop: '4px',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        height: '45px',
                                    },
                                },
                            },
                        }}
                        maxDateTime={endDateTime || undefined}
                    />

                    <DateTimePicker
                        value={endDateTime}
                        onChange={(newValue)=>setEndDateTime(newValue)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                helperText: 'Select end date',
                                sx: {
                                    '& .MuiInputBase-input': {
                                        fontSize: '0.8rem',
                                        padding: '8px',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        fontSize: '0.75rem',
                                        marginTop: '4px',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        height: '45px',
                                    },
                                },
                            },
                        }}
                        minDateTime={startDateTime || undefined}
                    />
                </Stack>
            </Box>
        </LocalizationProvider>
    );
}