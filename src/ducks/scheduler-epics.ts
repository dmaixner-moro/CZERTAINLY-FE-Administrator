import { AppEpic } from "ducks";
import { iif, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { extractError } from "utils/net";
import { actions as appRedirectActions } from "./app-redirect";
import { actions as widgetLockActions } from "./widget-locks";

import { store } from "index";
import { LockWidgetNameEnum } from "types/widget-locks";
import { EntityType } from "./filters";
import { actions as pagingActions } from "./paging";
import { slice } from "./scheduler";
import { transformSearchRequestModelToDto } from "./transform/certificates";
import {
    transformSchedulerJobDetailDtoToModel,
    transformSchedulerJobDtoToModel,
    transformSchedulerJobHistoryDtoToModel,
} from "./transform/scheduler";

const listSchedulerJobs: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listSchedulerJobs.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.SCHEDULER));
            return deps.apiClients.scheduler.listScheduledJobs({ pagination: transformSearchRequestModelToDto(action.payload) }).pipe(
                mergeMap((response) =>
                    of(
                        slice.actions.listSchedulerJobsSuccess(response.scheduledJobs.map(transformSchedulerJobDtoToModel)),
                        pagingActions.listSuccess({ entity: EntityType.SCHEDULER, totalItems: response.totalItems }),
                        widgetLockActions.removeWidgetLock(LockWidgetNameEnum.ListOfScheduler),
                    ),
                ),

                catchError((err) =>
                    of(
                        pagingActions.listFailure(EntityType.SCHEDULER),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get Scheduled Jobs list" }),
                        widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfScheduler),
                    ),
                ),
            );
        }),
    );
};

const getSchedulerJob: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getSchedulerJobDetail.match),

        switchMap((action) =>
            deps.apiClients.scheduler.getScheduledJobDetail({ uuid: action.payload.uuid }).pipe(
                switchMap((response) =>
                    of(
                        slice.actions.getSchedulerJobDetailSuccess(transformSchedulerJobDetailDtoToModel(response)),
                        widgetLockActions.removeWidgetLock(LockWidgetNameEnum.SchedulerJobDetail),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.getSchedulerJobDetailFailure({ error: extractError(err, "Failed to get Scheduled Job detail") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get Scheduled Job detail" }),
                        widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.SchedulerJobDetail),
                    ),
                ),
            ),
        ),
    );
};

const listSchedulerJobHistory: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listSchedulerJobHistory.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.SCHEDULER_HISTORY));
            return deps.apiClients.scheduler
                .getScheduledJobHistory({
                    uuid: action.payload.uuid,
                    pagination: transformSearchRequestModelToDto(action.payload.pagination),
                })
                .pipe(
                    mergeMap((response) =>
                        of(
                            slice.actions.listSchedulerJobHistorySuccess(
                                response.scheduledJobHistory.map(transformSchedulerJobHistoryDtoToModel),
                            ),
                            pagingActions.listSuccess({ entity: EntityType.SCHEDULER_HISTORY, totalItems: response.totalItems }),
                            widgetLockActions.removeWidgetLock(LockWidgetNameEnum.ListOfSchedulerHistory),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            pagingActions.listFailure(EntityType.SCHEDULER_HISTORY),
                            appRedirectActions.fetchError({ error: err, message: "Failed to get Scheduled Job History list" }),
                            widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfSchedulerHistory),
                        ),
                    ),
                );
        }),
    );
};

const deleteSchedulerJob: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteSchedulerJob.match),
        switchMap((action) =>
            deps.apiClients.scheduler.deleteScheduledJob({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    iif(
                        () => action.payload.redirect,
                        of(
                            slice.actions.deleteSchedulerJobSuccess({ uuid: action.payload.uuid }),
                            appRedirectActions.redirect({ url: "../../" }),
                        ),
                        of(slice.actions.deleteSchedulerJobSuccess({ uuid: action.payload.uuid })),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.deleteSchedulerJobFailure({ error: extractError(err, "Failed to delete Scheduled Job") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to delete Scheduled Job" }),
                    ),
                ),
            ),
        ),
    );
};

const enableSchedulerJob: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableSchedulerJob.match),
        switchMap((action) =>
            deps.apiClients.scheduler.enableScheduledJob({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.enableSchedulerJobSuccess({ uuid: action.payload.uuid })),

                catchError((err) =>
                    of(
                        slice.actions.enableSchedulerJobFailure({ error: extractError(err, "Failed to enable Scheduled Job") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to enable Scheduled Job" }),
                    ),
                ),
            ),
        ),
    );
};

const disableSchedulerJob: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableSchedulerJob.match),
        switchMap((action) =>
            deps.apiClients.scheduler.disableScheduledJob({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.disableSchedulerJobSuccess({ uuid: action.payload.uuid })),

                catchError((err) =>
                    of(
                        slice.actions.disableSchedulerJobFailure({ error: extractError(err, "Failed to disable Scheduled Job") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to disable Scheduled Job" }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [listSchedulerJobs, listSchedulerJobHistory, getSchedulerJob, deleteSchedulerJob, enableSchedulerJob, disableSchedulerJob];

export default epics;
