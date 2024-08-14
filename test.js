/* Hàm đếm thời gian thực thi hàm */
// function measureExecutionTime(fn) {
//     const startTime = performance.now();
//     fn();
//     const endTime = performance.now();
//     const executionTime = endTime - startTime;
//     console.log(`Execution time: ${executionTime} milliseconds`);
//     return executionTime;
// }

// function exampleFunction() {
//     //Todo
// }

// measureExecutionTime(exampleFunction);
const { deleteFile } = require('./src/helpers/deleteFile');

const path =
    'D:\\Hoc_hanh\\ViuChieuPhim\\Backend\\src\\img\\suppliers\\1723650126497-CGV_ticket_price.png';

deleteFile(path);
