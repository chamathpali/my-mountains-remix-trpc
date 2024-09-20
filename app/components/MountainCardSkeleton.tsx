import { BarChart2, Calendar, Footprints, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function MountainCardSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            <Skeleton className="h-8 w-48" />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center space-x-2">
          <Footprints className="text-gray-300" size={18} />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="text-gray-300" size={18} />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="text-gray-300" size={18} />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center space-x-2">
          <BarChart2 className="text-gray-300" size={18} />
          <span className="text-gray-300">Difficulty:</span>
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  )
}