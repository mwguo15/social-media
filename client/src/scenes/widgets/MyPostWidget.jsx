import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
  } from "@mui/icons-material";
  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
  } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Dropzone from "react-dropzone";
  import UserImage from "components/UserImage";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "state";
  
  const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false); // whether or not user has clicked image button (to add image)
    const [image, setImage] = useState(null); 
    const [post, setPost] = useState(""); // post content
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
  
    const handlePost = async () => {
      // structure to handle all the post data
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }
  
      // sending post info to the backend
      const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const posts = await response.json(); // backend sends updated posts
      dispatch(setPosts({ posts })); 
      setImage(null); // reset post
      setPost("");
    };
  
    return (
      <WidgetWrapper>
        <FlexBetween gap="1.5rem">
          <UserImage image={picturePath} />
          <InputBase
            placeholder="What's on your mind..."
            onChange={(e) => setPost(e.target.value)} // updating post
            value={post}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />
        </FlexBetween>
        {isImage && ( // put add image box if icon clicked 
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])} // set post image
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`} // when hovering over image box, change to pointer cursor
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!image ? ( // if image has been placed, have box name as image name
                      <p>Add Image Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                  {image && (
                    <IconButton
                      onClick={() => setImage(null)} // button for deleting picture
                      sx={{ width: "15%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}
  
        <Divider sx={{ margin: "1.25rem 0" }} />
  
        {/* Second row for post tools (image, clip, file attachment, audio recording) */}
        <FlexBetween> 
          <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}> 
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Image
            </Typography>
          </FlexBetween>
  
          {isNonMobileScreens ? (
            <>
              <FlexBetween gap="0.25rem">
                <GifBoxOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Clip</Typography>
              </FlexBetween>
  
              <FlexBetween gap="0.25rem">
                <AttachFileOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Attachment</Typography>
              </FlexBetween>
  
              <FlexBetween gap="0.25rem">
                <MicOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Audio</Typography>
              </FlexBetween>
            </>
          ) : ( // 3 dots dropdown on mobile instead of all icons
            <FlexBetween gap="0.25rem">
              <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
          )}
  
          <Button
            disabled={!post} // if there is any post information, user can submit
            onClick={handlePost} // on post submission, handlePost will run
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
        </FlexBetween>
      </WidgetWrapper>
    );
  };
  
  export default MyPostWidget;