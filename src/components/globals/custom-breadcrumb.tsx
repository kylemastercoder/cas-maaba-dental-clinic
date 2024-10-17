import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

const CustomBreadcrumb = ({
  page,
  subPage,
  subLink,
}: {
  page: string;
  subPage?: string;
  subLink?: string;
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {subPage ? (
            <BreadcrumbLink href={subLink}>{page}</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{page}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {subPage && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{subPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
