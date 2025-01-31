import merge from 'lodash.merge';
import React, { BaseSyntheticEvent, FC, ReactNode, useMemo } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';

import { Box, Stack } from '@chakra-ui/react';

import { StyleCtx } from '../hooks/useStyles';
import { Field, FormStyles, Schema } from '../types';
import { CheckboxField, checkboxFieldStyles } from './CheckboxField';
import { ArrayField, arrayFieldStyles, ObjectField, objectFieldStyles } from './Containers';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { SwitchField } from './SwitchField';
import { TextAreaField } from './TextAreaField';
import { TextField } from './TextField';

export interface FormProps {
  schema: Schema;
  handleSubmit: (values: any, e?: BaseSyntheticEvent) => void;
  styles?: FormStyles;
  overwriteDefaultStyles?: boolean;
  formOptions?: UseFormProps;
  children?: ReactNode;
}

const defaultStyles: FormStyles = {
  form: {
    container: {
      padding: 4,
    },
    title: {
      size: 'lg',
      marginBottom: 4,
    },
    fieldSpacing: 6,
    buttonGroup: {
      marginTop: 4,
    },
    submitButton: {
      size: 'sm',
    },
    resetButton: {
      size: 'sm',
    },
  },
  arrayField: arrayFieldStyles,
  objectField: objectFieldStyles,
  checkboxField: checkboxFieldStyles,
};

const renderField = ([name, field]: [string, Field]) => {
  let Component: any = null;

  switch (field.type) {
    case 'text':
      Component = TextField;
      break;

    case 'textArea':
      Component = TextAreaField;
      break;

    case 'number':
      Component = NumberField;
      break;

    case 'array':
      Component = ArrayField;
      break;

    case 'object':
      Component = ObjectField;
      break;

    case 'switch':
      Component = SwitchField;
      break;

    case 'checkbox':
      Component = CheckboxField;
      break;

    case 'select':
      Component = SelectField;
      break;

    case 'custom':
      Component = field.component;
      return (
        <Box key={`${name}-container`}>
          <Component name={name} field={field} {...field.props} />
        </Box>
      );

    default:
      break;
  }

  return (
    <Box key={`${name}-container`}>
      <Component name={name} field={field} />
    </Box>
  );
};

export const Form: FC<FormProps> = ({
  schema,
  handleSubmit,
  formOptions,
  overwriteDefaultStyles,
  children,
  styles = {},
}) => {
  const form = useForm(formOptions);

  const baseStyles = useMemo(() => {
    return overwriteDefaultStyles ? styles : merge(defaultStyles, styles);
  }, [styles, overwriteDefaultStyles]);

  return (
    <StyleCtx.Provider value={baseStyles}>
      <FormProvider {...form}>
        <Box
          as="form"
          onSubmit={form.handleSubmit(handleSubmit)}
          {...baseStyles.form?.container}
        >
          <Stack spacing={baseStyles.form?.fieldSpacing}>
            {Object.entries(schema).map(renderField)}
          </Stack>
          {children}
        </Box>
      </FormProvider>
    </StyleCtx.Provider>
  );
};
