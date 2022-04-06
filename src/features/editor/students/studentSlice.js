import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

const studentsAdapter = createEntityAdapter()

const emptyInitialState = studentsAdapter.getInitialState()
const initialState = studentsAdapter.upsertMany(emptyInitialState, [
  // { id: 1, name: "Матвей", class: "8", schedule: [[{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},],] },
  // { id: 2, name: "Павел", class: "8", schedule: [[{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},],] },
  // { id: 3, name: "Таисия", class: "8", schedule: [[{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},],] },
  // { id: 4, name: "Тихон", class: "8", schedule: [[{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},],] },
  // { id: 5, name: "Саша", class: "9", schedule: [[{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},], [{}, {}, {}, {}, {},],] },
])


export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    studentAdded: studentsAdapter.addOne,
    studentDetailsChanged: (state, action) => {
      const s = state.entities[action.payload.id]
      const res = { ...s, ...action.payload }
      state.entities[action.payload.id] = res
    },
    studentDeleted: studentsAdapter.removeOne,
    lessonSet: (state, action) => {
      const { i: { studentId, dayI, lessonI }, lesson } = action.payload
      state.entities[studentId].schedule[dayI][lessonI] = lesson
    },
    lessonMoved: (state, action) => {
      const { iTo, iFrom } = action.payload
      if (iFrom.studentId == iTo.studentId && iFrom.dayI == iTo.dayI && iFrom.lessonI == iTo.lessonI) { return }
      state.entities[iTo.studentId].schedule[iTo.dayI][iTo.lessonI] = state.entities[iFrom.studentId].schedule[iFrom.dayI][iFrom.lessonI]
      state.entities[iFrom.studentId].schedule[iFrom.dayI][iFrom.lessonI] = {}
    },
    lessonDeleted: (state, action) => {
      const { studentId, dayI, lessonI } = action.payload
      state.entities[studentId].schedule[dayI][lessonI] = {}
    },
    lessonRoomAdded: (state, action) => {
      const { studentId, dayI, lessonI, roomName } = action.payload
      state.entities[studentId].schedule[dayI][lessonI].room = roomName
    },
    dayAdded: (state, action) => {
      for (const studentId in state.entities) {
        state.entities[studentId].schedule.append([])
      }
    },
    lessonFieldAdded: (state, action) => {
      state.entities[action.payload.studentId].schedule[action.payload.dayI].push({})
    },
    lessonFieldDeleted: (state, action) => {
      state.entities[action.payload.studentId].schedule[action.payload.dayI].pop()
    },
  },
});

export default studentsSlice.reducer;
export const { studentAdded, studentDeleted, lessonSet, lessonMoved, lessonDeleted, dayAdded, lessonRoomAdded, lessonFieldAdded, lessonFieldDeleted, studentDetailsChanged } = studentsSlice.actions

export const {
  selectAll: selectAllStudents,
  selectById: selectStudentById,
  selectIds: selectStudentIds
} = studentsAdapter.getSelectors(state => state.students)

export function transformStudentsToScheduleData(students) {
  if (!students || students.length == 0) {
    return [[], [], [], [], []]
  }
  let res = students[0].schedule.map((item) => [])

  for (const s of students) {
    for (const [dayI, daySchedule] of s.schedule.entries()) {
      if (res[dayI][s.className] == undefined) {
        res[dayI][s.className] = { name: s.className, students: {} }
      }
      res[dayI][s.className].students[s.id] = s.schedule[dayI]
    }
  }
  return res.map(day => Object.values(day))
}

export { studentsAdapter }