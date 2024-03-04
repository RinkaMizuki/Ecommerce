import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RecyclingIcon from '@mui/icons-material/Recycling';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaymentIcon from '@mui/icons-material/Payment';
import HomeIcon from '@mui/icons-material/Home';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { SvgIcon } from '@mui/material';
import styles from "./AccountMenu.module.scss";
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
  const theme = useTheme();
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    ...other
  } = props;

  const styleProps = {
    '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
    '--tree-view-bg-color':
      theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            pr: 0,
          }}
        >
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={styleProps}
      {...other}
      ref={ref}
    />
  );
});

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

export default function AccountMenu() {
  return (
    <div className={cx("menu-manager-container")}>
      <TreeView
        aria-label="Account management"
        defaultExpanded={['3']}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        sx={{
          flexGrow: 1, minWidth: 250, overflowY: 'auto', marginBottom: "10px",
          ".MuiBox-root ~ p": {
            fontFamily: "Poppins",
            fontWeight: 500,
            fontSize: "15px"
          }
        }}
        defaultSelected="5"

      >
        <StyledTreeItem nodeId="3" labelText="Manage My Account" labelIcon={ManageAccountsIcon}
        >
          <StyledTreeItem
            nodeId="5"
            labelText="My Profile"
            labelIcon={AccountBoxIcon}
            color="#1a73e8"
            bgColor="#e8f0fe"
            colorForDarkMode="#B8E7FB"
            bgColorForDarkMode="#071318"
          />
          <StyledTreeItem
            nodeId="6"
            labelText="Address Book"
            labelIcon={HomeIcon}
            color="#e3742f"
            bgColor="#fcefe3"
            colorForDarkMode="#FFE2B7"
            bgColorForDarkMode="#191207"
          />
          <StyledTreeItem
            nodeId="7"
            labelText="My Payment Options"
            labelIcon={PaymentIcon}
            color="#a250f5"
            bgColor="#f3e8fd"
            colorForDarkMode="#D9B8FB"
            bgColorForDarkMode="#100719"
          />
        </StyledTreeItem>
      </TreeView>

      <TreeView
        aria-label="Orders management"
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        sx={{
          flexGrow: 1, maxWidth: 250, overflowY: 'auto', marginBottom: "10px",
          ".MuiBox-root ~ p": {
            fontFamily: "Poppins",
            fontWeight: 500,
            fontSize: "15px"
          }
        }}
      >
        <StyledTreeItem nodeId="8" labelText="Manage Orders" labelIcon={ManageHistoryIcon}>
          <StyledTreeItem
            nodeId="10"
            labelText="My Returns"
            labelIcon={RecyclingIcon}
            labelInfo="10"
            color="#a250f5"
            bgColor="#f3e8fd"
            colorForDarkMode="#D9B8FB"
            bgColorForDarkMode="#100719"
          />
          <StyledTreeItem
            nodeId="11"
            labelText="My Cancellations"
            labelIcon={DisabledByDefaultIcon}
            labelInfo="5"
            color="#e3742f"
            bgColor="#fcefe3"
            colorForDarkMode="#FFE2B7"
            bgColorForDarkMode="#191207"
          />

        </StyledTreeItem>
      </TreeView>
    </div>
  );
}