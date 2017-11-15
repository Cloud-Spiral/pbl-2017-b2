package jp.enpit.facitter.entities;

import javax.xml.bind.annotation.XmlElement;

public class Line {
    @XmlElement(name="lid")
    private int lid;
    @XmlElement(name="line")
    private String line;
    @XmlElement(name="index")
    private int index;

    public Line() {}
    
    public Line(int index, String line){
        this.index = index;
        this.line = line;
    }
    
    public Line(int lid, int index, String line){
        this(index, line);
        setLid(lid);
    }

    public String getLine() {
		return line;
	}
    public int getIndex() {
		return index;
	}
	public int getLid(){
        return lid;
    }
	
	public void setIndex(Integer index){
		this.index = index;
	}

	public void setIndex(int index) {
		this.index = index;
	}
	
	public void setLid(Integer lid){
		this.lid = lid;
	}

	public void setLid(int lid) {
		this.lid = lid;
	}
	public void setLine(String line) {
		this.line = line;
	}
	
	@Override
	public String toString(){
		String str="{";
		str = str + "lid = "+ lid+
				" : index = \""+ index +
				" : line = \""+ line +"}";
		return str;
	}

}
