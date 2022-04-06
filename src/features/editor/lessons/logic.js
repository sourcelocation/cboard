const objectMap = (obj, fn) => Object.fromEntries(
  Object.entries(obj).map(
    ([k, v], i) => [k, fn(v, k, i)]
  )
)

export function getPlacements(newLesson, schedule) {
  console.log(schedule);
  let res = schedule.map(d => d.map(c => objectMap(c.students, v => v.map(l => true))))
  for (const [dayI, day1] of schedule.entries()) {
    for (const [classI1, class1] of day1.entries()) {
      for (const studentId1 in class1.students) {
        const student1 = class1.students[studentId1]
        for (const [lessonI1, lesson1] of student1.entries()) {
          if (lesson1?.teacherId == newLesson?.teacherId) {
            // Getting every field and setting "red" fields, which will be unavailable due to *this* field.
            for (const [classI2, class2] of day1.entries()) {
              for (const studentId2 in class2.students) {
                const student2 = class2.students[studentId2]

                if (classI1 !== classI2) {
                  console.log(classI1,classI2);
                  console.log(res, dayI, classI2, studentId2, lessonI1);
                  res[dayI][classI2][studentId2][lessonI1] = false
                }
              }
            }
          }
        }
      }
    }
  }
  return res
}