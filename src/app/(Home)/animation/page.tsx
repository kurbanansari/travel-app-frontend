// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams ,useRouter} from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { fetchTripPhotos } from "@/redux/thunk/photoThunk";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { fetchTripById } from "@/redux/thunk/tripsThunk";
// import TripPhotos from "@/components/TripPhotos";

// export default function AnimationPage() {
//   const searchParams = useSearchParams();
//    const router = useRouter();
//   const tripId = searchParams.get("tripId");
//   const dispatch = useDispatch<AppDispatch>();
//   const { photos, loading } = useSelector((state: RootState) => state.photos);
//   const { currentTrip } = useSelector((state: RootState) => state.trips);

  
//    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
   
  
//   useEffect(() => {
//     if (tripId) {
//       dispatch(fetchTripById(tripId));   
//       dispatch(fetchTripPhotos(tripId));
//     }
//   }, [dispatch, tripId]);

//   const toggleSelect = (id: string) => {
//     setSelectedPhotos((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };
//   const handleAnimationStyle = () => {
//     alert(`Creating animation with ${selectedPhotos.length} photo(s)`);
//     // 👉 Here you can call your backend or animation logic
//   };

//   if (loading) return <div className="p-6 text-center">Loading photos...</div>;
   

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-green-50 px-2 sm:px-4">
//         <Card className="w-full max-w-xl mt-8 rounded-2xl shadow-lg bg-green-100 relative">
//        <CardHeader className="pt-6 pb-6">
//           <CardTitle className="text-2xl font-bold text-center">
//            {currentTrip ? currentTrip?.title : "Trip"}
//           </CardTitle>
//         </CardHeader>

      
//       <CardContent>
//       {/* Photos Grid */}
//       <div className="mb-25">
//        <TripPhotos
//             selectable
//             selected={selectedPhotos}
//             setSelected={setSelectedPhotos}
//           />
//        </div>
//       {/* Bottom Fixed Bar */}
//       <div className="max-w-lg w-full flex justify-between absolute bottom-6">
//         <span className="text-gray-600">
//           {selectedPhotos.length} photo selected
//         </span>
//         <div>
//             <Button
//                 disabled={selectedPhotos.length === 0}
//                 onClick={() =>
//                   router.push(
//                     `/animation/animationStyle?tripId=${tripId}&photos=${selectedPhotos.join(",")}`
//                   )
//                 }
//                 className="bg-green-700 p-4 pl-10 pr-10 hover:bg-green-800"
//               >
//                 Proceed
//               </Button>
//         </div>
//       </div>
//       </CardContent>
//     </Card>
//     </div>
//   );
// }





import {Suspense} from 'react'
import AnimationPageContent from "@/components/AnimationPageContent"
export default function AnimationPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <AnimationPageContent />
    </Suspense>
  );
}
