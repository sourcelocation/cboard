import { createSlice, createSelector } from '@reduxjs/toolkit'
import { editorDataReceived, editorMessageReceived } from '../../api/apiSlice';
import { selectAllStudents } from '../students/studentSlice';

const initialState = { days: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"], rooms: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27"] }


const scheduleInfoSlice = createSlice({
  name: 'scheduleInfo',
  initialState,
  reducers: {
    addDay: (state, action) => {
      state.days.push(action.payload)
    },
    addRoom: (state, action) => {
      state.rooms.push(action.payload)
    }
  },
  extraReducers(builder) {
      // .addMatcher(editorMessageReceived, (state, action) => {
      //   const data = action.data
      //   if (data) {
      //     const type = data.type
      //     state.data = [[], [], [], [], []]
      //   }
      // })
      // .addMatcher(editorDataReceived, (state, action) => {
      //   const data = action.payload
      //   if (data && data.students) {
      //     const students = data.students
      //     console.log(students);
      //     state.data = transformStudentsToScheduleData(students)
      //   }
      // })
  }
});


export const selectDays = state => state.scheduleInfo.days

const selectRooms = state => {
  return state.scheduleInfo.rooms
}
export const selectRoomsForLessonI = createSelector([(state, i) => i, selectRooms, selectAllStudents],
  (i, roomsList, students) => {
    if (i) {
      const lessonPlacing = students.find(s => s.id == i.studentId).schedule[i.dayI][i.lessonI]
      const rowPlacedLessons = Array.from(new Set(students.map(s => {
        const l = s.schedule[i.dayI][i.lessonI]
        return l
      }).filter(l => l !== undefined)))

      let unallowed = []
      //let allowOnlyRoom = null // TODO
      for (const l of rowPlacedLessons) {
        if (!(lessonPlacing.lessonId == l.lessonId && lessonPlacing.teacherId == l.teacherId) && l.room) {
          unallowed.push(l.room)
        } else {
          // foundExactMatch = true
        }
      }
      unallowed = Array.from(new Set(unallowed))

      return [...roomsList.filter(r => unallowed.find(r1 => r1 == r) === undefined).map(r => {
        return {
          name: r,
          available: true
        }
      }
      ), ...unallowed.map(r => {
        return {
          name: r,
          available: false
        }
      }
      ),]
    }
  }
)



export const {
  addDay,
  addRoom,
} = scheduleInfoSlice.actions
export default scheduleInfoSlice.reducer