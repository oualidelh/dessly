import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";


const BioCard = ({ fullName, profession}: { fullName: string; profession: string; }) => {

  return (
    <Card className="w-full bg-white border-none rounded-xl">
      <CardHeader>
        <div>Full Name:</div>
        <CardTitle>{fullName}</CardTitle>
        <div>Profession:</div>
        <CardDescription>{profession}</CardDescription>
      </CardHeader>
      
    </Card>
  );
};

export default BioCard;
