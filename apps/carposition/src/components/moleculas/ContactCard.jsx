import styled from "styled-components";

export function ContactCard({ 
  icon, 
  title, 
  link, 
  linkText, 
  bg = "#232d2e", 
  iconColor, 
  iconBg = "#fff", // color de fondo del círculo
  linkColor, 
  linkHoverColor 
}) {
  return (
    <Card $bg={bg}>
      <div className="icon-col">
        <span
          className="icon"
          style={{
            color: iconColor,
            background: iconBg
          }}
        >
          {icon}
        </span>
      </div>
      <div className="content-col">
        <span className="title">{title}</span>
        <a
          className="link"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: linkColor }}
          onMouseOver={e => { if (linkHoverColor) e.currentTarget.style.color = linkHoverColor; }}
          onMouseOut={e => { if (linkColor) e.currentTarget.style.color = linkColor; }}
        >
          {linkText}
        </a>
      </div>
    </Card>
  );
}

const Card = styled.div`
  width: 100%;
  background: ${({ $bg }) => $bg};
  border-radius: 10px;
  padding: 10px 18px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 14px 0 rgba(47, 115, 82, 0.03);

  .icon-col {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 13px;
  }
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    font-size: 2rem;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 4px 0 rgba(47, 115, 82, 0.12);
    /* Elimina el padding para que sea perfectamente circular */
    padding: 0;
  }
  .content-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-width: 0;
  }
  .title {
    display: block;
    font-size: 0.8rem;
    color: #b4b4b4;
    font-weight: 500;
    margin-bottom: 2px;
    text-align: left;
  }
  .link {
    font-weight: 600;
    font-size: 0.8rem;
    display: inline-block;
    margin-top: 2px;
    transition: color 0.2s;
    text-align: left;
    text-decoration: underline;
    &:hover {
      text-decoration: underline;
    }
  }
`;
