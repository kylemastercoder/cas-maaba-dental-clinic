import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Supplies } from "@prisma/client";
import { Badge } from "../ui/badge";

const SupplyInventoryTable = ({ data }: { data: Supplies[] }) => {
  return (
    <Card className="md:h-[235px] overflow-auto">
      <CardHeader>
        <CardTitle>Inventories Running Out of Stocks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Stocks</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((supply) => (
                <TableRow key={supply.id}>
                  <TableCell>{supply.name}</TableCell>
                  <TableCell>{supply.quantity - supply.used}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Running out of stock</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SupplyInventoryTable;
