const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { streamArray } = require("stream-json/streamers/StreamArray");
const fs = require("fs");

const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

const memoryData = process.memoryUsage();

const memoryUsage = {
  rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
  heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
  heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
  external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`
};

console.log(memoryUsage);

const startTime = process.hrtime();

const pipeline = chain([
  fs.createReadStream("large-file2.json"), // Replace with your JSON file path
  parser(),
  streamArray()
]);

process.title = "Read big JSON";
pipeline.on("data", ({ value }) => {
  const memoryData = process.memoryUsage();

  const memoryUsage = {
    rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
    heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
    heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
    external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`
  };

  // if (value.id === 4363653288778275) {
  //   console.log("Found Parent2:", value);
  //   const endTime = process.hrtime(startTime);
  //   console.log(`Execution time: ${endTime[0]}s ${endTime[1] / 1000000}ms`);
  //   console.log(memoryUsage);
  //   pipeline.destroy(); // Stop processing after finding the desired object
  // }
});

pipeline.on("end", () => {
  console.log("Finished processing");

  const memoryData = process.memoryUsage();

  const memoryUsage = {
    rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
    heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
    heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
    external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`
  };

  const endTime = process.hrtime(startTime);
  console.log(`Execution time: ${endTime[0]}s ${endTime[1] / 1000000}ms`);
  console.log(memoryUsage);
  pipeline.destroy(); // Stop processing after finding the desired object
});

pipeline.on("error", (err) => {
  console.error("Error:", err);
});
