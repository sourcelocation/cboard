export function getPlacements(newLesson, schedule) {
  // let res = Object.assign({}, ...students.map(s => ({[s.id]: s.schedule.map(d => d.map(lesson => true))}) ))
  let res = schedule.map(d => d.map(c => Object.values(c.students).map(s => s.map(l => true) ) ) )
  // console.log(performance.now());
  for (const day of schedule) {
    for (const class1 of day) {
      
    }
  }
  // for (const student of students)  {
  //   for (const [dayI, lessons] of student.schedule.entries()) {
  //     for (const [lessonI, lesson] of lessons.entries()) {
  //       if (lesson.teacherId == newLesson.teacherId) {
  //         for (const [i,otherStudent] of students.entries())  {
  //           if (otherStudent.className !== student.className) {
  //             res[otherStudent.id][dayI][lessonI] = false
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  // console.log(performance.now());
  return res
}