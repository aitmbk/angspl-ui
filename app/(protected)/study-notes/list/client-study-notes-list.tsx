'use client';
import { memo, useCallback } from 'react';
import eq from 'lodash/eq';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import MyDataGrid from '@/app/custom-components/MyDataGrid';
import MyLink from '@/app/custom-components/MyLink';
import MyConfirmDialog from '@/app/custom-components/MyConfirmDialog';
import MyCardContent from '@/app/custom-components/MyCardContent';
import MyTypography from '@/app/custom-components/MyTypography';
import MyMenu from '@/app/custom-components/MyMenu';
import MyMenuItem from '@/app/custom-components/MyMenuItem';
import MyBreadcrumbs from '@/app/custom-components/MyBreadcrumbs';
import MyCard from '@/app/custom-components/MyCard';
import MyEditIcon from '@/app/custom-components/MyEditIcon';
import MyClearIcon from '@/app/custom-components/MyClearIcon';
import useStudyNotesList from './useStudyNotesList';
import StudyNotesDTO from '@/app/types/StudyNotesDTO';

type Props = {
  arrStudyNotesDTO: StudyNotesDTO[];
  total_records: number;
};
const ClientStudyNotesList = ({ arrStudyNotesDTO, total_records }: Props) => {
  const {
    state,
    apiRef,
    paginationModel,
    setPaginationModel,
    onCheckChange,
    onDeleteClick,
    onEditClick,
    onAddClick,
    onDeleteAllClick,
    onSortChange,
    toggleDialog,
    DeleteSingle,
    DeleteSelected,
    handleContextMenu,
    handleClose,
    onContextMenu,
    onFilterModelChange,
    onRowDoubleClick,
    onDeleteSingleClose
  } = useStudyNotesList({ arrStudyNotesDTO, total_records });

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Id',
      flex: 1
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      renderCell: useCallback(
        (params: GridRenderCellParams) => <MyLink href={'/study-notes/view/' + params.row.id}>{params.row.title}</MyLink>,
        []
      )
    },
    {
      field: 'course_name',
      headerName: 'Course name',
      flex: 1
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const notesData = params.row.description?.code || '';
        return <span style={{ whiteSpace: 'pre-wrap' }}>{notesData}</span>;
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1
    }
  ];

  return (
    <>
      <MyBreadcrumbs items={state.breadcrumbsItems}></MyBreadcrumbs>
      <MyCard>
        <MyCardContent>
          <MyDataGrid
            apiRef={apiRef}
            rowSelectionModel={state.arrSelectedId}
            initialStateModel={state.initialState}
            sortModel={[{ field: state.sort_field, sort: state.sort_direction }]}
            onSortModelChange={onSortChange}
            onRowSelectionModelChange={onCheckChange}
            rows={state.arrStudyNotesDTO}
            rowCount={state.total_records}
            columns={columns}
            loading={state.isLoading}
            handleContextMenu={handleContextMenu}
            onAddClick={onAddClick}
            showAddButton={true}
            onDeleteClick={onDeleteAllClick}
            showDeleteButton={state.arrSelectedId.length > 0}
            onFilterModelChange={onFilterModelChange}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowDoubleClick={onRowDoubleClick}
          />

          <MyMenu
            open={state.contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              state.contextMenu !== null
                ? {
                    top: state.contextMenu.mouseY,
                    left: state.contextMenu.mouseX
                  }
                : undefined
            }
            slotProps={{
              root: {
                onContextMenu: onContextMenu
              }
            }}
          >
            <MyMenuItem onClick={onEditClick}>
              <MyEditIcon />
              Edit
            </MyMenuItem>
            <MyMenuItem onClick={onDeleteClick}>
              <MyClearIcon />
              Delete
            </MyMenuItem>
          </MyMenu>
        </MyCardContent>
      </MyCard>
      {state.visibleDialog && (
        <MyConfirmDialog
          open={state.visibleDialog}
          title="Confirm Code Project Removal"
          onNoClick={toggleDialog}
          onYesClick={DeleteSelected}
          onClose={toggleDialog}
        >
          <MyTypography variant="body1"> Are you sure you want to delete this item? This cannot be undone.</MyTypography>
        </MyConfirmDialog>
      )}
      {state.visibleDialog1.visibility && (
        <MyConfirmDialog
          open={state.visibleDialog1.visibility}
          title="Confirm Code Project Removal"
          onNoClick={onDeleteSingleClose}
          onYesClick={DeleteSingle}
          onClose={onDeleteSingleClose}
        >
          <MyTypography variant="body1">Are you sure you want to delete this item? This cannot be undone.</MyTypography>
        </MyConfirmDialog>
      )}
    </>
  );
};

export default memo(ClientStudyNotesList, (prevProps, nextProps) => {
  return eq(prevProps, nextProps);
});
