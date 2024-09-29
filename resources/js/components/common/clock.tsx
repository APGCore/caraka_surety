"use client";

import { useEffect, useMemo, useState } from "react";

const addZeroPrefix = (nums: number) => (nums < 10 ? `0${nums}` : nums);

function getCurrentIndonesiaTime() {
    const currentDate = new Date();

    // Set threshold hours to determine which time zone to use
    const witThresholdHour = currentDate.getHours() + 1; // Threshold for East Indonesia Time (WIT)
    const witaThresholdHour = currentDate.getHours() + 2; // Threshold for Middle Indonesia Time (WITA)

    let timeZone;
    let timeZoneAlias;

    // Compare current hour against thresholds to determine the time zone
    const currentHour = currentDate.getHours();
    if (currentHour >= witThresholdHour) {
        timeZone = "Asia/Jayapura"; // East Indonesia Time (WIT)
        timeZoneAlias = "WIT";
    } else if (currentHour >= witaThresholdHour) {
        timeZone = "Asia/Makassar"; // Middle Indonesia Time (WITA)
        timeZoneAlias = "WITA";
    } else {
        timeZone = "Asia/Jakarta"; // Western Indonesia Time (WIB)
        timeZoneAlias = "WIB";
    }

    const options: Intl.DateTimeFormatOptions = {
        timeZone,
        weekday: "long", // Full name of the day (e.g., Minggu)
        year: "numeric", // 4-digit year
        month: "long", // Full name of the month (e.g., September)
        day: "numeric", // Day of the month (e.g., 22)
    };

    const formatter = new Intl.DateTimeFormat("id-ID", options);
    const formattedDate = formatter.format(currentDate);

    return {
        timeZone,
        timeZoneAlias,
        formattedDate,
    };
}

export type ClockType = {
    initialDate?: Date;
};

const Clock = ({ initialDate }: ClockType) => {
    const [time, setTime] = useState(initialDate ?? new Date());
    const { timeZoneAlias, formattedDate } = getCurrentIndonesiaTime();
    const formattedTime = useMemo(() => {
        return `${addZeroPrefix(time.getHours())}:${addZeroPrefix(
            time.getMinutes()
        )}:${addZeroPrefix(time.getSeconds())}`;
    }, [time]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-max">
            <div className="flex w-[102px] text-[16px] font-bold  justify-between ">
                <p>{formattedTime}</p>
                <p>{timeZoneAlias}</p>
            </div>
            <p className="text-sm font-medium">{formattedDate}</p>
        </div>
    );
};

export default Clock;
