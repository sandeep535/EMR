import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Box, Paper, Typography, TextField } from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({ name: yup.string().max(1500) }).required();

const Notes = forwardRef((props, ref) => {
  const [description, setDescription] = useState('');
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: { name: '' },
    resolver: yupResolver(schema),
  });

  const charCount = (watch('name') || '').length;

  useImperativeHandle(ref, () => ({
    getFormData: () => ({ description }),
    setFormData: (data) => {
      setValue('name', data, { shouldTouch: true, shouldDirty: true });
      setDescription(data);
    },
    submitFormmData: () => { handleSubmit(notesHandle)(); },
  }), [description]);

  const notesHandle = (data) => setDescription(data.name);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
        <NoteAltIcon sx={{ fontSize: 18, color: '#673AB7' }} />
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          {props.label || 'Notes'}
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(notesHandle)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={5}
                size="small"
                variant="outlined"
                placeholder="Type your notes here..."
                error={!!errors.name?.message}
                helperText={errors.name?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: 13,
                    '&:hover fieldset': { borderColor: '#673AB7' },
                    '&.Mui-focused fieldset': { borderColor: '#673AB7' },
                  },
                }}
              />
            )}
          />
          <Box sx={{ textAlign: 'right', mt: 0.5 }}>
            <Typography variant="caption" color={charCount > 1400 ? 'error' : 'text.disabled'}>
              {charCount} / 1500
            </Typography>
          </Box>
        </form>
      </Box>
    </Paper>
  );
});

Notes.displayName = 'Notes';
export default Notes;
