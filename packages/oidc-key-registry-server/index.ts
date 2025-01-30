const task = () => {
  console.log('Hello World');
  setTimeout(task, 1000);
}

task();