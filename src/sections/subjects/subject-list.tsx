import { Dispatch, SetStateAction, useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { SubjectItem } from './subject-item';
import { SbjItem } from 'src/types/subject';
import { UseBooleanReturn } from 'minimal-shared/hooks';


// ----------------------------------------------------------------------

type Props = {
  subjects: SbjItem[];
  rowSelected: Dispatch<SetStateAction<SbjItem | null>>;
  openForm: UseBooleanReturn;
  confirmDelete: UseBooleanReturn;
  setSelectedId: Dispatch<SetStateAction<string>>;
};

export function SubjectList({ subjects, rowSelected, openForm, confirmDelete, setSelectedId }: Props) {
  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
        }}
      >
        {subjects.map((s) => (
          <SubjectItem
            key={s.id}
            sx={{
              boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'
            }}
            subject={s}
            rowSelected={rowSelected}
            onDelete={confirmDelete}
            openForm={openForm}
            setSelectedId={setSelectedId}
          />
        ))}
      </Box>

      {subjects.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
