import {differenceInCalendarDays, startOfYear, subDays} from 'date-fns'

export const getYTDDays = () => {
    const start = startOfYear(new Date())
    const days = differenceInCalendarDays(new Date(), start)
    return days
}

export const calculateDateRange = (daysPast: number) => {
    return { from: subDays(new Date(), daysPast), to: new Date()}
}