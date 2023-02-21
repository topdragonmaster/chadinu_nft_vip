/** 

=========================================================
* Vision UI PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Visionware.

*/

// prop-type is a library for typechecking of props
import PropTypes from "prop-types";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VUI/VuiBox";
import VuiTypography from "components/VUI/VuiTypography";
import VuiInput from "components/VUI/VuiInput";

function FormField({ label, ...rest }) {
  const validateUserId = async (value) => {
    console.log(value);
}
  return (
    <>
      <VuiBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
        <VuiTypography
          component="label"
          variant="h6"
          fontWeight="bold"
          textTransform="capitalize"
          color="white"
        >
          {label}
        </VuiTypography>
      </VuiBox>
      <VuiInput
        xmlns="http://www.w3.org/1999/xhtml"
        sx={({ borders: { borderWidth }, palette: { borderCol } }) => ({
          border: `${borderWidth[1]} solid ${borderCol.main}`,
        })}
        size="medium"
        {...rest}
      />
      
    </>
  );
}

// typechecking props for FormField
FormField.propTypes = {
  label: PropTypes.string.isRequired,
};

export default FormField;
