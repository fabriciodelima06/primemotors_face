import cron from 'node-cron'

export const getTasks = () => {
   let tasks = []
   cron.getTasks().forEach(task => tasks.push(task))
   return tasks
}

export const startStopCronTask = async (isStart, funcao) => {
   const tasks = getTasks()

   if (isStart) { 
      // ┌────────────── second (optional)
      // │ ┌──────────── minute
      // │ │ ┌────────── hour
      // │ │ │ ┌──────── day of month
      // │ │ │ │ ┌────── month
      // │ │ │ │ │ ┌──── day of week
      // │ │ │ │ │ │
      // │ │ │ │ │ │
      // * * * * * *
      // obs: é necessário reniciar o servidor caso precise mudar o tempo
      if (!tasks[0]) tasks[0] = cron.schedule('* * * * * *', () => funcao(), { runOnInit: true })
      tasks[0].start()
   } else {
      tasks[0].stop()
   }
}