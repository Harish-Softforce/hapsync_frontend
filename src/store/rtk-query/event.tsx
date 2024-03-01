import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//import { staticConfigs } from '../../utils/configs';
import Config from "react-native-config";

export const eventsApi = createApi({
    reducerPath: 'eventsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: Config.BASE_URL + '/hapsync-backend/',
    }),
    tagTypes: ['Events', 'EventCategories'],
    endpoints: (builder) => ({
        getEvents: builder.query({
            query: (id: number) => {
                return {
                    url: `/user/${id}/events`,
                    method: 'get',
                }
            },
            providesTags: ['Events']
        }),
        getEventById: builder.query({
            query: ({
                eventId
            }) => {
                return {
                    url: `event/${eventId}/getEventDetails`,
                    method: 'get',
                }
            },
            providesTags: ['Events']
        }),
        addEvent: builder.mutation({
            query: (data) => {
                return {
                    url: `/event/addevent`,
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                    method: 'post',
                    body: data
                }
            },
            invalidatesTags: ['Event']
        }),
        getEventCategories: builder.query({
            query: () => {
                return {
                    url: `eventCategory/getAllEventCategories`,
                    method: 'get',
                }
            },
        }),
    }),

});

export const { useGetEventsQuery } = eventsApi;