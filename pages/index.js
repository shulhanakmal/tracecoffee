import React, { useState, useEffect } from "react";

const Dashboard = React.lazy(() =>
  import("../components/exportir/dashboard/dashboard")
);

export default function Home() {
  return (
    <>
      <Dashboard />
    </>
  );
}
