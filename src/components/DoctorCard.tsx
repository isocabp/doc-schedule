import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star } from "lucide-react";

type DoctorProps = {
  doctor: {
    id: number;
    name: string;
    specialty: string;
    city: string;
    rating: number;
    image: string;
  };
};

export default function DoctorCard({ doctor }: DoctorProps) {
  return (
    <Card className="overflow-hidden">
      <Image
        src={doctor.image}
        alt={doctor.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-neutral-900">
          {doctor.name}
        </h2>
        <p className="text-sm text-neutral-600">{doctor.specialty}</p>
        <p className="text-sm text-neutral-600">{doctor.city}</p>

        <div className="flex items-center gap-1 mt-2">
          <Star className="h-4 w-4 text-yellow-500" fill="#facc15" />
          <span className="text-sm font-medium">{doctor.rating}</span>
        </div>

        <Button className="w-full mt-4">Agendar Consulta</Button>
      </CardContent>
    </Card>
  );
}
