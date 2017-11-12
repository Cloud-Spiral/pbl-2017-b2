package jp.enpit.facitter.entities;

import javax.xml.bind.annotation.XmlElement;

public class Husen {
    @XmlElement(name="hid")
    private int hid;
    @XmlElement(name="text")
    private String text;
    @XmlElement(name="xPosition")
    private String xPosition;
    @XmlElement(name="yPosition")
    private String yPosition;
    @XmlElement(name="height")
    private String height;
    @XmlElement(name="good")
    private int good;
    @XmlElement(name="bad")
    private int bad;
    @XmlElement(name="color")
    private int color;
    @XmlElement(name="canEditPerson")
    private int canEditPerson;

    public Husen() {}
    
    public Husen(String text, String xPosition, String yPosition, String height,
            int good, int bad, int color,int canEditPerson){
        this.text = text;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.height = height;
        this.good = good;
        this.bad = bad;
        this.color = color;
        this.canEditPerson = canEditPerson;
    }
    
    public Husen(int hid, String text, String xPosition, String yPosition, String height,
    		int good, int bad, int color, int canEditPerson){
        this(text, xPosition, yPosition, height, good, bad, color, canEditPerson);
        setHid(hid);
    }

    public String getText() {
		return text;
	}

	public String getxPosition() {
		return xPosition;
	}

	public String getyPosition() {
		return yPosition;
	}

	public int getGood() {
		return good;
	}
	
	public String getHeight(){
		return height;
	}

	public int getBad() {
		return bad;
	}

	public int getColor() {
		return color;
	}

	public int getCanEditPerson() {
		return canEditPerson;
	}

	public int getHid(){
        return hid;
    }
	
	public void setHid(Integer hid){
		this.hid = hid;
	}

	public void setHid(int hid) {
		this.hid = hid;
	}
	
	@Override
	public String toString(){
		String str="{";
		str = str + "hid = "+ hid+
        " : text = \""+ text+
        "\" : xPosition = \""+ xPosition+
        "\" : yPosition = \""+ yPosition+
        "\" : height = \""+ height+
        "\" : good = "+ good+
        " : bad = "+ bad+
        " : color = "+ color+
        " : canEdit = "+ canEditPerson +"}";
		return str;
	}

	public void setText(String text) {
		this.text = text;
	}

	public void setxPosition(String xPosition) {
		this.xPosition = xPosition;
	}

	public void setyPosition(String yPosition) {
		this.yPosition = yPosition;
	}

	public void setHeight(String height) {
		this.height = height;
	}

	public void setGood(int good) {
		this.good = good;
	}

	public void setBad(int bad) {
		this.bad = bad;
	}

	public void setColor(int color) {
		this.color = color;
	}

	public void setCanEditPerson(int canEdit) {
		this.canEditPerson = canEdit;
	}
}
