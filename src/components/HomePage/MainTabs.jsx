import { TabContext, TabPanel } from "@mui/lab";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { BookGrid } from "./BookGrid";
import React, { useState } from "react";
export const MainTabs = ({ featuredBooks, popularBooks, categorizedBooks }) => {
  const [tabValue, setTabValue] = useState("0");

  return (
    <TabContext value={tabValue}>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
        <Tab label="Featured Books" value="0" />
        <Tab label="Popular Books" value="1" />
        <Tab label="Categories" value="2" />
      </Tabs>

      <TabPanel value="0">
        <BookGrid books={featuredBooks} />
      </TabPanel>
      <TabPanel value="1">
        <BookGrid books={popularBooks} />
      </TabPanel>
      <TabPanel value="2">
        {categorizedBooks.map((category) => (
          <Box key={category.category} mb={4}>
            <Typography variant="h6" fontWeight="bold">
              {category.category}
            </Typography>
            <BookGrid books={category.books} />
          </Box>
        ))}
      </TabPanel>
    </TabContext>
  );
};
