import { Delete, Edit } from "@mui/icons-material";
import {
  Alert,
  Button,
  IconButton,
  Paper,
  Switch,
  TableCell,
  TableRow,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { TableLayout } from "../../components";
import { ShowImage } from "../../components/common";
import { menuItemsHeadCells } from "../../helpers/constants";

const MenuItemsTable = ({
  editItem,
  rows,
  deleteRow,
  parentName = false,
  total,
  handleClicked,
  handleClicked2,
  setEditActive,
  imageButton,
  imageButtonHandler,
  image,
  deleteAllHandler,
}) => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams, setSearchParams] = useSearchParams();

  const { id: ids } = useParams();
  return (
    <>
      {" "}
      <TableLayout
        title={`آیتم های ${parentName}`}
        headers={menuItemsHeadCells}
        /*   search={setSearchingWord} */
        rows={rows}
        /*       setRows={setShowingRows} */
        actions={["فعال / غیر فعال", "ویرایش", "حذف", "آیتم منو"]}
        length={total}
        name={"  منو "}
        addButton={userPermissions?.menu?.insert}
        handleClicked={handleClicked}
        maxHeight="79.5vh"
        extraBuuton="ویرایش اولویت ها"
        extraBuutonHandler={handleClicked2}
        imageButton={imageButton}
        imageButtonHandler={imageButtonHandler}
        image={image}
        deleteAll={userPermissions?.menu?.deleteAll}
        deleteAllHandler={deleteAllHandler}
      >
        {rows?.map((row, index) => {
          const { id, title, link, image, itemValue, itemType, active } = row;
          return (
            <TableRow hover key={index}>
              <TableCell align="center">{id}</TableCell>
              <TableCell align="center">
                <div className="flex justify-center">
                  {" "}
                  <ShowImage address={image} />
                </div>
              </TableCell>
              <TableCell align="center">{title}</TableCell>

              <TableCell align="center">{link}</TableCell>
              <TableCell align="center">
                <Switch
                  onChange={() => setEditActive({ ...row, active: !active })}
                  checked={active}
                  disabled={!userPermissions?.menu?.update}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  disabled={!userPermissions?.menu?.update}
                  onClick={() => editItem(row)}
                >
                  <Edit color="warning" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  disabled={!userPermissions?.menu?.delete}
                  onClick={() => deleteRow(id)}
                >
                  <Delete color="error" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                {" "}
                <Button
                  onClickCapture={() => {
                    var temp;
                    if (sessionStorage.getItem("steps")) {
                      temp = {
                        ...JSON.parse(sessionStorage.getItem("steps")),
                        [id]: {
                          title: title,
                          location: `/menu/${ids}?name=${title}&parent=${id}&itemValue=${itemValue}&firstParent=${searchParams.get(
                            "firstParent"
                          )}&itemType=${itemType}`,
                          prev: searchParams.get("parent"),
                        },
                      };
                    } else {
                      temp = {
                        [id]: {
                          title: title,
                          location: `/menu/${ids}?name=${title}&parent=${id}&itemValue=${itemValue}&firstParent=${searchParams.get(
                            "firstParent"
                          )}&itemType=${itemType}`,
                          prev: searchParams.get("parent"),
                        },
                      };
                    }
                    sessionStorage.setItem("steps", JSON.stringify(temp));
                  }}
                  onClick={() => {
                    if (itemType !== 0) {
                      window.open(
                        `/menu/${ids}?name=${title}&parent=${id}&itemValue=${itemValue}&firstParent=${searchParams.get(
                          "firstParent"
                        )}&itemType=${itemType}`
                      );
                    } else {
                      window.open(
                        `/menu/${ids}?name=${title}&parent=${id}&firstParent=${searchParams.get(
                          "firstParent"
                        )}`
                      );
                    }
                  }}
                  variant="outlined"
                >
                  مشاهده
                </Button>{" "}
              </TableCell>
            </TableRow>
          );
        })}
      </TableLayout>
      <Paper elevation={0} sx={{ mt: 2 }}>
         <Alert title="توجه" severity="info"  variant="outlined">
        /shop/category-mobile/brand-sony/public-publicattributes-slug/facet-nameofattributes-attributesvalue/from-155000000-up-to-209000000
        <br />
        اگه با category- شروع بشه یعنی اسلاگ کتگوری هست <br />
        اگه با brand- شروع بشه اسلاگ برند <br />
        اگه با facet- شروع بشه اسلاگ ویزگی هست <br />
        اگه با public- شروع بشه اسلاگ ویژگی عمومی <br />
        بازه قیمت بین
        from-value(1500000)-up-to-value(1500000) قرار میگیره از این به بعد{" "}
      </Alert>
      </Paper>
     
    </>
  );
};

export default MenuItemsTable;
