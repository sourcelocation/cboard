
import { createAction, createSelector } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { lessonsAdapter } from '../editor/lessons/lessonsSlice';
import { studentsAdapter } from '../editor/students/studentSlice';
import { teachersAdapter } from '../editor/teachers/teachersSlice';
import { applyActionOnDraft } from './applyActionOnDraft';

export let websocketConnection

function createWebsocketMutation(builder, actionName) {
  return builder.mutation({
    queryFn: () => { },
    async onQueryStarted(inputOptions, { dispatch, queryFulfilled }) {
      const actionData = { [actionName]: 'true', ...inputOptions }
      websocketConnection.ws.send(JSON.stringify(actionData))
      const patchResult = dispatch(apiSlice.util.updateQueryData('getEditorData', websocketConnection.projectId, (draft) => {
        applyActionOnDraft(draft, actionData)
      }))
    },
  })
}
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `http://127.0.0.1:8080`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('user-token')
      if (token && !headers.get("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Organization'],
  endpoints: builder => ({
    login: builder.mutation({
      query: (values) => ({
        url: "/login",
        method: "POST",
        headers: {
          'Authorization' : `Basic ${window.btoa(values.email + ':' + values.password)}`
        }
      })
    }),
    organization: builder.query({
      query: () => '/organization',
      providesTags: () => [{ type: 'Organization' }],
    }),
    addProject: builder.mutation({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: { name: project.name }
      }),
      invalidatesTags: ['Organization'],
    }),
    generateExcel: builder.query({
      query: (id) => ({
        url: `/project/${id}/generateExcel`
      })
    }),




    getEditorData: builder.query({
      query: (id) => `/project/${id}`,
      transformResponse(response) {
        return {
          students: studentsAdapter.setAll(
            studentsAdapter.getInitialState(),
            response.students
          ),
          lessons: lessonsAdapter.setAll(
            studentsAdapter.getInitialState(),
            response.lessons
          ),
          teachers: teachersAdapter.setAll(
            teachersAdapter.getInitialState(),
            response.teachers
          ),
        }
      },
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch, getCacheEntry }) {
        await cacheDataLoaded
        const receivedData = getCacheEntry().data
        const usertoken = localStorage.getItem('user-token')

        const connect = () => {
          websocketConnection = { ws: new WebSocket(`ws://127.0.0.1:8080/editor/ws/${arg}?token=${usertoken}`), projectId: arg }

          websocketConnection.ws.addEventListener('message', async function (event) {
            if (event.data) {
              const actionData = JSON.parse(event.data)
              updateCachedData((draft) => {
                applyActionOnDraft(draft, actionData)
              })
            }
          })
          // websocketConnection.ws.onclose = function (e) {
          //   console.log(e);
          //   console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
          //   setTimeout(function () {
          //     connect();
          //   }, 1000);
          // };


          // Creates infinite loop ^^
        }

        if (websocketConnection == undefined || websocketConnection.ws.readyState >= 2 || websocketConnection.projectId != arg) {
          connect()
        }
        await cacheEntryRemoved
        websocketConnection.ws.close()
      },
    }),
    editorMoveLesson: createWebsocketMutation(builder, "moveScheduleLessonAction"),
    editorCopyLesson: createWebsocketMutation(builder, "copyScheduleLessonAction"),
    editorLessonFieldCount: createWebsocketMutation(builder, "lessonFieldCountAction"),
    editorSetScheduleLessonRoom: createWebsocketMutation(builder, "setScheduleLessonRoomAction"),

    editorAddStudent: createWebsocketMutation(builder, "addStudentAction"),
    editorUpdateStudent: createWebsocketMutation(builder, "updateStudentAction"),
    editorDeleteStudent: createWebsocketMutation(builder, "deleteStudentAction"),

    editorAddLesson: createWebsocketMutation(builder, "addLessonAction"),
    editorUpdateLessons: createWebsocketMutation(builder, "updateLessonsAction"),
    editorDeleteLesson: createWebsocketMutation(builder, "deleteLessonAction"),

    editorAddTeacher: createWebsocketMutation(builder, "addTeacherAction"),
    editorUpdateTeachers: createWebsocketMutation(builder, "updateTeachersAction"),
    editorDeleteTeacher: createWebsocketMutation(builder, "deleteTeacherAction"),

    editorMultipleActions: createWebsocketMutation(builder, "multipleActions")
  })
})

export const selectUsersResult = apiSlice.endpoints.getEditorData.select()

export const {
  useLoginMutation,
  useOrganizationQuery,
  useGetEditorDataQuery,
  useAddProjectMutation,
  useGenerateExcelQuery,

  useEditorMoveLessonMutation,
  useEditorCopyLessonMutation,
  useEditorLessonFieldCountMutation,
  useEditorSetScheduleLessonRoomMutation,

  useEditorAddStudentMutation,
  useEditorUpdateStudentMutation,
  useEditorDeleteStudentMutation,

  useEditorAddLessonMutation,
  useEditorUpdateLessonsMutation,
  useEditorDeleteLessonMutation,

  useEditorAddTeacherMutation,
  useEditorUpdateTeachersMutation,
  useEditorDeleteTeacherMutation,

  useEditorMultipleActionsMutation,
} = apiSlice