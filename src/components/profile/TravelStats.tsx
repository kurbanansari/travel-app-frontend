"use client";

type TravelStatsProps = {
  profile: any;
};

export default function TravelStats({ profile }: TravelStatsProps) {
  return (
    <div className="flex gap-3 justify-center mt-6 mb-6 px-4">
      <div className="flex-1 bg-[#FFF4CC] rounded-xl py-4 flex flex-col items-center shadow">
        <span className="font-bold text-lg">{profile.totalDistanceKm}KM</span>
        <span className="text-xs text-gray-600">Total Distance Traveled</span>
      </div>
      <div className="flex-1 bg-[#FFF4CC] rounded-xl py-4 flex flex-col items-center shadow">
        <span className="font-bold text-lg">{profile.daysSpentTraveling}</span>
        <span className="text-xs text-gray-600">Days Spent Traveling</span>
      </div>
    </div>
  );
}
