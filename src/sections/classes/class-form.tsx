
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';



import { toast } from 'src/components/snackbar';
import { Field } from 'src/components/hook-form';
import { ClassItem, ClassListResponse, ClassResponse, Grade } from 'src/types/classes';
import { z } from 'zod';
import { Autocomplete, CardHeader, Chip, MenuItem, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { createClass, getClasses, getDetails, updateClass } from 'src/api/classes';
// ----------------------------------------------------------------------

// ------------------- SCHEMA ---------------------
export const ClassSchema = z.object({
    name: z.string().min(1, { message: 'Tên lớp là bắt buộc' }),
    description: z.string().min(1, { message: 'Mô tả là bắt buộc' }),
    grade: z.string().min(1, { message: 'Khối lớp là bắt buộc' }),
    academicYear: z.string().min(1, { message: 'Niên khóa là bắt buộc' }),
    homeroomTeacherId: z.string().min(1, { message: 'Giáo viên chủ nhiệm là bắt buộc' }),
    teacherIds: z.array(z.string()).optional(),
    studentIds: z.array(z.string()).optional(),
});

export type ClassSchemaType = z.infer<typeof ClassSchema>;

type Teacher = { id: string; name: string };
type Student = { id: string; name: string };

type Props = {
    currentClass?: ClassItem;
    teachers: Teacher[];
    students: Student[];
    handleClose: () => void;
    resetResponse: Dispatch<SetStateAction<ClassListResponse | null>>;
};

export function ClassForm({ currentClass, teachers, students, handleClose, resetResponse }: Props) {
    const _mockGrade = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Sau đại học'];
    const _mockYear = ['2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Thông tin lớp học', 'Phân bổ giáo viên & học sinh'];
    const [members, setMembers] = useState<ClassResponse | null>(null);

    const fetchMembersInClass = async () => {
        if (currentClass) {
            const res = await getDetails(currentClass?.id || '');
            setMembers(res);
        }
    }

    useEffect(() => {
        fetchMembersInClass();
    }, [currentClass]);

    const defaultValues: ClassSchemaType = {
        name: currentClass?.name || '',
        description: currentClass?.description || '',
        grade: currentClass?.grade || '',
        academicYear: currentClass?.academicYear || '',
        homeroomTeacherId: currentClass?.homeroomTeacher?.id || '',
        teacherIds: members?.teachers.map(t => t.user.id) || [],
        studentIds: members?.students.map(s => s.id) || [],
    };

    const methods = useForm<ClassSchemaType>({
        resolver: zodResolver(ClassSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        reset,
        control,
        trigger,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const bodyPayload = {
                homeroomTeacherId: data.homeroomTeacherId,
                name: data.name,
                grade: data.grade as Grade,
                description: data.description,
                academicYear: data.academicYear,
                students: data.studentIds ?? [],
                teachers: data.teacherIds ?? [],
            };

            if (currentClass) {
                await updateClass(currentClass.id, bodyPayload);
                toast.success('Cập nhật dữ liệu thành công');
            } else {
                await createClass(bodyPayload);
                toast.success('Tạo mới thành công');
            }

            const dataReset = await getClasses();
            resetResponse(dataReset);

            reset();
            handleClose?.();
        } catch (error) {
            console.error(error);
            toast.error('Đã có lỗi xảy ra');
        }
    });

    const handleNext = async () => {
        const isValid = await trigger(['name', 'description', 'grade', 'homeroomTeacherId']);
        if (isValid) setActiveStep(1);
    };

    return (
        <FormProvider {...methods}>
            <Card sx={{ p: 3 }}>
                <CardHeader
                    title={currentClass ? 'Chỉnh sửa lớp học' : 'Tạo mới lớp học'}
                    sx={{ px: 0, pt: 0, mb: 2 }}
                />

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <form onSubmit={onSubmit}>
                    <Stack spacing={3}>
                        {activeStep === 0 ? (
                            <>
                                <Field.Text name="name" label="Tên lớp học" />
                                <Field.Text name="description" label="Mô tả lớp học" />
                                <Field.Text
                                    name="grade"
                                    label="Khối lớp"
                                    select
                                    SelectProps={{ native: false }}
                                >
                                    {_mockGrade.map((g) => (
                                        <MenuItem key={g} value={g}>
                                            {g}
                                        </MenuItem>
                                    ))}
                                </Field.Text>
                                <Field.Text
                                    name="academicYear"
                                    label="Niên khóa"
                                    select
                                    SelectProps={{ native: false }}
                                >
                                    {_mockYear.map((g) => (
                                        <MenuItem key={g} value={g}>
                                            {g}
                                        </MenuItem>
                                    ))}
                                </Field.Text>

                                <Controller
                                    name="homeroomTeacherId"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} fullWidth select label="Giáo viên chủ nhiệm">
                                            {teachers.map((teacher) => (
                                                <MenuItem key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </>
                        ) : (
                            <>
                                <Controller
                                    name="teacherIds"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            multiple
                                            options={teachers}
                                            getOptionLabel={(option) => option.name}
                                            value={teachers.filter((t) => field.value?.includes(t.id))}
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue.map((v) => v.id));
                                            }}
                                            noOptionsText="Không còn giáo viên nào trống"
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip
                                                        variant="outlined"
                                                        label={option.name}
                                                        {...getTagProps({ index })}
                                                        key={option.id}
                                                    />
                                                ))
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Chọn thêm giáo viên"
                                                    placeholder="Giáo viên"
                                                />
                                            )}
                                        />
                                    )}
                                />

                                <Controller
                                    name="studentIds"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            multiple
                                            options={students}
                                            getOptionLabel={(option) => option.name}
                                            value={students.filter((s) => field.value?.includes(s.id))}
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue.map((v) => v.id));
                                            }}
                                            noOptionsText="Không còn học sinh nào trống"
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip
                                                        variant="outlined"
                                                        label={option.name}
                                                        {...getTagProps({ index })}
                                                        key={option.id}
                                                    />
                                                ))
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Chọn học sinh"
                                                    placeholder="Chọn học sinh"
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </>
                        )}

                        <Stack direction="row" justifyContent="space-between">
                            {activeStep > 0 ? (
                                <Button type="button" variant="outlined" onClick={() => setActiveStep((s) => s - 1)}>
                                    Quay lại
                                </Button>
                            ) : (
                                <Button type="button" variant="outlined" onClick={() => handleClose()}>
                                    Hủy bỏ
                                </Button>
                            )}

                            {activeStep < steps.length - 1 ? (
                                <Button type="button" variant="contained" onClick={(e) => {
                                    e.preventDefault();
                                    handleNext();
                                }}>
                                    Tiếp theo
                                </Button>
                            ) : (
                                <Button type="submit" variant="contained" loading={isSubmitting}>
                                    Lưu
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </form>
            </Card>
        </FormProvider>
    );
}

