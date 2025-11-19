'use client';

import { Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, CircularProgress } from "@mui/material"
import { outlineButton, button } from "@/app/theme/typography"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import InputField from "@/components/InputField"
import { profileService } from "@/app/services/profileService"
import { successAlert, errorAlert } from "@/components/ToastGroup"

interface CertificatesProps {
  user: any;
  refreshProfile: () => Promise<void>;
  isEditMode?: boolean;
}

const Certificates = ({ user, refreshProfile, isEditMode = true }: CertificatesProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const certificates = user?.certificates || [];

  const certificateSchema = Yup.object().shape({
    name: Yup.string().test('conditional-required', 'Certificate name is required', function(value) {
      const { issuer, issueDate } = this.parent;
      const hasAnyValue = issuer || issueDate;
      if (hasAnyValue) {
        return !!value && value.trim() !== '';
      }
      return true;
    }),
    issuer: Yup.string().test('conditional-required', 'Issuer is required', function(value) {
      const { name, issueDate } = this.parent;
      const hasAnyValue = name || issueDate;
      if (hasAnyValue) {
        return !!value && value.trim() !== '';
      }
      return true;
    }),
    issueDate: Yup.string().test('conditional-required', 'Issue date is required', function(value) {
      const { name, issuer } = this.parent;
      const hasAnyValue = name || issuer;
      if (hasAnyValue) {
        return !!value && value.trim() !== '';
      }
      return true;
    }),
    expiryDate: Yup.string(),
    credentialId: Yup.string(),
    credentialUrl: Yup.string(),
  });

  const validationSchema = Yup.object({
    certificates: Yup.array().of(certificateSchema),
  });

  const formik = useFormik({
    initialValues: {
      certificates: certificates.length > 0 ? certificates.map((cert: any) => ({
        name: cert?.name || '',
        issuer: cert?.issuer || '',
        issueDate: cert?.issueDate ? (typeof cert.issueDate === 'string' ? cert.issueDate.split('T')[0] : new Date(cert.issueDate).toISOString().split('T')[0]) : '',
        expiryDate: cert?.expiryDate ? (typeof cert.expiryDate === 'string' ? cert.expiryDate.split('T')[0] : new Date(cert.expiryDate).toISOString().split('T')[0]) : '',
        credentialId: cert?.credentialId || '',
        credentialUrl: cert?.credentialUrl || '',
      })) : [{ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' }],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const certificatesData = values.certificates
          .filter((cert: any) => cert.name && cert.issuer)
          .map((cert: any) => ({
            name: cert.name,
            issuer: cert.issuer,
            issueDate: cert.issueDate ? new Date(cert.issueDate) : new Date(),
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined,
            credentialId: cert.credentialId || undefined,
            credentialUrl: cert.credentialUrl || undefined,
          }));
        const data = await profileService.updateProfile({
          certificates: certificatesData,
        });
        if (data.success && data.data) {
          localStorage.setItem('user', JSON.stringify(data.data));
          await refreshProfile();
          setOpen(false);
          successAlert('Certificates updated successfully!', 'top-right');
        }
      } catch (error: any) {
        // Check if error has validation errors structure
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach((err: any) => {
            // Handle nested certificate fields like "certificates.0.name"
            const fieldMatch = err.field?.match(/certificates\.(\d+)\.(.+)/);
            if (fieldMatch) {
              const index = fieldMatch[1];
              const fieldName = fieldMatch[2];
              const fullFieldName = `certificates.${index}.${fieldName}`;
              formik.setFieldError(fullFieldName, err.message);
              formik.setFieldTouched(fullFieldName, true);
            } else {
              const fieldName = err.field || '';
              if (fieldName) {
                formik.setFieldError(fieldName, err.message);
                formik.setFieldTouched(fieldName, true);
              }
            }
          });
          errorAlert(error.message || 'Please fix the validation errors.', 'top-right');
        } else {
          errorAlert(error.message || 'Failed to update certificates.', 'top-right');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (certificates && certificates.length > 0) {
      formik.setValues({
        certificates: certificates.map((cert: any) => ({
          name: cert?.name || '',
          issuer: cert?.issuer || '',
          issueDate: cert?.issueDate ? (typeof cert.issueDate === 'string' ? cert.issueDate.split('T')[0] : new Date(cert.issueDate).toISOString().split('T')[0]) : '',
          expiryDate: cert?.expiryDate ? (typeof cert.expiryDate === 'string' ? cert.expiryDate.split('T')[0] : new Date(cert.expiryDate).toISOString().split('T')[0]) : '',
          credentialId: cert?.credentialId || '',
          credentialUrl: cert?.credentialUrl || '',
        })),
      });
    } else {
      formik.setValues({
        certificates: [{ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' }],
      });
    }
  };

  const addCertificate = () => {
    formik.setValues({
      certificates: [...formik.values.certificates, { name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' }],
    });
  };

  const removeCertificate = (index: number) => {
    const newCertificates = formik.values.certificates.filter((_: any, i: number) => i !== index);
    formik.setValues({
      certificates: newCertificates.length > 0 ? newCertificates : [{ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' }],
    });
  };

  return (
    <>
      <Grid size={{ xs: 12, md: 4 }} sx={{
        backgroundColor: '#16796f',
        color: '#fff',
        padding: { xs: '16px', md: '20px' },
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxHeight: { xs: '400px', md: '600px' },
        overflowY: 'auto',
      }}>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h3" color="white" sx={{ fontSize: { xs: '1.25rem', md: '2rem' } }}>
            Certificates
          </Typography>
          {isEditMode && (
            <IconButton
              onClick={handleOpen}
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <EditIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
            </IconButton>
          )}
        </div>
        
              {certificates.length > 0 ? (
          certificates.map((cert: any, index: number) => {
            const issueDate = cert?.issueDate ? (typeof cert.issueDate === 'string' ? cert.issueDate : new Date(cert.issueDate).toLocaleDateString()) : null;
            const expiryDate = cert?.expiryDate ? (typeof cert.expiryDate === 'string' ? cert.expiryDate : new Date(cert.expiryDate).toLocaleDateString()) : null;
            return (
              <Box key={index} sx={{ mb: 3, pb: 2, borderBottom: index < certificates.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none' }}>
                <Typography variant="body1" color="white" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {cert?.name || 'Untitled Certificate'}
                </Typography>
                <Typography variant="body2" color="white" sx={{ opacity: 0.8, mb: 0.5 }}>
                  Issued by: {cert?.issuer || '--'}
                </Typography>
                {issueDate && (
                  <Typography variant="body2" color="white" sx={{ opacity: 0.8, mb: 0.5 }}>
                    Issue Date: {issueDate}
                  </Typography>
                )}
                {expiryDate && (
                  <Typography variant="body2" color="white" sx={{ opacity: 0.8, mb: 0.5 }}>
                    Expiry Date: {expiryDate}
                  </Typography>
                )}
                {cert?.credentialId && (
                  <Typography variant="body2" color="white" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                    ID: {cert?.credentialId}
                  </Typography>
                )}
              </Box>
            );
          })
        ) : (
          <Typography variant="body1" color="white" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
            No certificates added yet
          </Typography>
        )}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px',
            m: { xs: 2, md: 3 },
            maxHeight: { xs: '90vh', md: 'auto' },
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, px: { xs: 2, md: 3 } }}>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.25rem', md: '2rem' } }}>
            Edit Certificates
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ px: { xs: 2, md: 3 }, overflowY: 'auto' }}>
            <Grid container spacing={2}>
              {formik.values.certificates.map((cert: any, index: number) => (
                <Box key={index} sx={{ width: '100%', mb: 3, p: 2, border: '1px solid #D0D5DD', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Certificate {index + 1}</Typography>
                    {formik.values.certificates.length > 1 && (
                      <Button 
                        onClick={() => removeCertificate(index)}
                        sx={{ color: '#F04438', textTransform: 'none' }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <InputField
                        label="Certificate Name"
                        name={`certificates.${index}.name`}
                        type="text"
                        placeholder="Enter certificate name"
                        formik={formik}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <InputField
                        label="Issuer"
                        name={`certificates.${index}.issuer`}
                        type="text"
                        placeholder="Enter issuer name"
                        formik={formik}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <InputField
                        label="Issue Date"
                        name={`certificates.${index}.issueDate`}
                        type="date"
                        placeholder="Enter issue date"
                        formik={formik}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <InputField
                        label="Expiry Date (Optional)"
                        name={`certificates.${index}.expiryDate`}
                        type="date"
                        placeholder="Enter expiry date"
                        formik={formik}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <InputField
                        label="Credential ID"
                        name={`certificates.${index}.credentialId`}
                        type="text"
                        placeholder="Enter credential ID"
                        formik={formik}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <InputField
                        label="Credential URL"
                        name={`certificates.${index}.credentialUrl`}
                        type="text"
                        placeholder="Enter credential URL"
                        formik={formik}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Grid size={{ xs: 12 }}>
                <Button 
                  onClick={addCertificate}
                  sx={{ ...outlineButton, width: '100%' }}
                >
                  Add Another Certificate
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, md: 3 }, pb: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button 
              sx={{ ...outlineButton, height: "50px", width: { xs: '100%', sm: "160px" } }} 
              onClick={handleClose} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              sx={{ ...button, width: { xs: '100%', sm: 'auto' }, px: 4 }} 
              type="submit" 
              disabled={isLoading || !formik.isValid}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Saving...
                </Box>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default Certificates

