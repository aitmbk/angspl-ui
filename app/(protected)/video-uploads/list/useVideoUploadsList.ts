import { useCallback, useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useLazyQuery } from '@apollo/client';
import {
  GridEventListener,
  GridFilterModel,
  GridRowSelectionModel,
  GridSortModel,
  useGridApiRef,
  GridInitialState
} from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import { SortDirectionType, ContextMenuType, defaultPageSize } from '../../../common/Configuration';
import VideoUploadsDTO from '@/app/types/VideoUploadsDTO';
import { BreadcrumbsItem } from '@/app/custom-components/MyBreadcrumbs';
import { VIDEO_UPLOADS_LIST, DELETE_VIDEO_UPLOADS } from '@/app/graphql/VideoUploads';

type visibleDialog1Type = { id: string; visibility: boolean };

type StateType = {
  isLoading: boolean;
  arrVideoUploadsDTO: VideoUploadsDTO[];
  total_records: number;
  filter_text: string;
  sort_field: string;
  sort_direction: SortDirectionType;
  visibleDialog: boolean;
  visibleDialog1: visibleDialog1Type;
  selectedRow: string;
  arrSelectedId: string[];
  contextMenu: ContextMenuType | null;
  initialState: GridInitialState;
  breadcrumbsItems: BreadcrumbsItem[];
};

type Props = {
  arrVideoUploadsDTO: VideoUploadsDTO[];
  total_records: number;
};
const useVideoUploadsList = ({ arrVideoUploadsDTO, total_records }: Props) => {
  const router = useRouter();
  const apiRef = useGridApiRef();
  const INITIAL_STATE: StateType = Object.freeze({
    isLoading: false,
    arrVideoUploadsDTO: arrVideoUploadsDTO,
    total_records: total_records,
    filter_text: '',
    sort_field: 'id',
    sort_direction: 'desc',
    visibleDialog: false,
    visibleDialog1: { id: '', visibility: false },
    selectedRow: '',
    arrSelectedId: [],
    contextMenu: null,
    initialState: {
      columns: {
        columnVisibilityModel: { id: false }
      }
    },
    breadcrumbsItems: [{ label: 'Video Uploads' }]
  });

  const reducer = (state = INITIAL_STATE, action: StateType): StateType => {
    return { ...state, ...action };
  };

  const [state, setState] = useReducer(reducer, INITIAL_STATE);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: defaultPageSize
  });

  const [getVideoUploadsList] = useLazyQuery(VIDEO_UPLOADS_LIST, {
    fetchPolicy: 'network-only', // Doesn't check cache before making a network request
    variables: {
      filter_text: state.filter_text,
      sort_field: state.sort_field,
      sort_direction: state.sort_direction,
      offset: paginationModel.page * paginationModel.pageSize,
      limit: paginationModel.pageSize
    }
  });

  const [deleteVideoUploads] = useMutation(DELETE_VIDEO_UPLOADS, {});

  const getVideoUploadsData = useCallback(async (): Promise<void> => {
    setState({ isLoading: true } as StateType);
    let arrVideoUploadsDTO: VideoUploadsDTO[] = [];
    let total_records: number = 0;
    const { error, data } = await getVideoUploadsList();
    if (!error && data) {
      arrVideoUploadsDTO = data.getVideoUploadsList.videoUploads.map((item: VideoUploadsDTO) => {
        return { ...item, id: parseInt(item.id.toString()) };
      });
      total_records = data.getVideoUploadsList.total_records;
    }
    setState({
      arrVideoUploadsDTO: arrVideoUploadsDTO,
      total_records: total_records,
      isLoading: false,
      arrSelectedId: [] as string[]
    } as StateType);
  }, [getVideoUploadsList]);

  useEffect(() => {
    getVideoUploadsData();
  }, [getVideoUploadsData, state.filter_text, state.sort_field, state.sort_direction, paginationModel]);

  const handleClose = useCallback(async (): Promise<void> => {
    setState({ contextMenu: null } as StateType);
  }, []);

  const toggleDialog = useCallback(async (): Promise<void> => {
    setState({ visibleDialog: !state.visibleDialog } as StateType);
  }, [state.visibleDialog]);

  const toggleDialog1 = useCallback(
    async (id: string): Promise<void> => {
      setState({ visibleDialog1: { id: id, visibility: !state.visibleDialog1.visibility } } as StateType);
    },
    [state.visibleDialog1.visibility]
  );

  const onSortChange = useCallback(
    async (model: GridSortModel): Promise<void> => {
      if (model.length > 0) {
        setState({ sort_field: model[0].field, sort_direction: model[0].sort?.toString() as SortDirectionType } as StateType);
      } else {
        setState({ sort_field: state.sort_field, sort_direction: 'asc' } as StateType);
      }
    },
    [state.sort_field]
  );

  const handleContextMenu = useCallback(
    async (event: React.MouseEvent<HTMLElement>): Promise<void> => {
      event.preventDefault();
      setState({
        selectedRow: event.currentTarget.getAttribute('data-id') as string,
        contextMenu: state.contextMenu === null ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 } : null
      } as StateType);
    },
    [state.contextMenu]
  );

  const onRowDoubleClick: GridEventListener<'rowDoubleClick'> = useCallback(
    async (params) => {
      router.push('/video-uploads/edit/' + params.row.id);
    },
    [router]
  );

  const onEditClick = useCallback(
    async (event: React.MouseEvent<HTMLElement>): Promise<void> => {
      event.preventDefault();
      router.push('/video-uploads/edit/' + state.selectedRow);
    },
    [router, state.selectedRow]
  );

  const onDeleteClick = useCallback(
    async (event: React.MouseEvent<HTMLElement>): Promise<void> => {
      event.preventDefault();
      await toggleDialog1(state.selectedRow);
      await handleClose();
    },
    [toggleDialog1, handleClose, state.selectedRow]
  );

  const DeleteSingle = useCallback(
    async (event: React.MouseEvent<HTMLElement>): Promise<void> => {
      event.preventDefault();
      const params = [Number(state.visibleDialog1.id)];
      const { data } = await deleteVideoUploads({
        variables: {
          ids: params
        }
      });
      await toggleDialog1('');
      if (data) {
        getVideoUploadsData();
        toast.success('record(s) deleted successfully');
      } else {
        toast.error('Error occured while deleting record');
      }
    },
    [deleteVideoUploads, getVideoUploadsData, state.visibleDialog1.id, toggleDialog1]
  );

  const onCheckChange = useCallback(async (model: GridRowSelectionModel): Promise<void> => {
    setState({ arrSelectedId: model as string[] } as StateType);
  }, []);

  const onAddClick = useCallback(
    async (event: React.MouseEvent<HTMLElement>): Promise<void> => {
      event.preventDefault();
      router.push('/video-uploads/add');
    },
    [router]
  );

  const onDeleteAllClick = useCallback(
    async (event: React.MouseEvent<HTMLElement>): Promise<void> => {
      event.preventDefault();
      await toggleDialog();
    },
    [toggleDialog]
  );

  const DeleteSelected = useCallback(
    async (event: React.MouseEvent<HTMLElement>): Promise<void> => {
      event.preventDefault();
      const { data } = await deleteVideoUploads({
        variables: {
          ids: state.arrSelectedId
        }
      });
      await toggleDialog();
      if (data) {
        getVideoUploadsData();
        toast.success('record(s) deleted successfully');
      } else {
        toast.error('Error occured while deleting record(s)');
      }
    },
    [deleteVideoUploads, getVideoUploadsData, state.arrSelectedId, toggleDialog]
  );

  const onContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleClose();
    },
    [handleClose]
  );

  const onFilterModelChange = useCallback(async (newFilterModel: GridFilterModel): Promise<void> => {
    let filterText = '';
    if (newFilterModel.quickFilterValues) {
      filterText = newFilterModel.quickFilterValues[0] ?? '';
    }
    setState({ filter_text: filterText } as StateType);
  }, []);

  const onDeleteSingleClose = useCallback(async () => {
    toggleDialog1('');
  }, [toggleDialog1]);

  return {
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
  };
};

export default useVideoUploadsList;
