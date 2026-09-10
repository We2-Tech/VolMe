import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

/** Replaces v1's hand-rolled LoadingComponent: the framework shows this while a
 *  Server Component's data is still resolving. */
export default function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
      <CircularProgress />
    </Box>
  )
}
