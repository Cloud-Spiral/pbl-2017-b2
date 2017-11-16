package jp.enpit.facitter.entities;

import javax.xml.bind.annotation.XmlElement;

public class User {
	@XmlElement(name = "name")
	private String name;

	private String password;
	private boolean status;

	public User() {
		setName("ゲスト");
		setPassword("password");
		setStatus(true);
	}

	public User(String name) {
		setName(name);
		setPassword("password");
		setStatus(true);
	}

	public User(String name, String password) {
		setName(name);
		setPassword(password);
		setStatus(true);
	}
	
	public User(String name, String password, boolean status) {
		this(name, password);
		setStatus(status);
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPassword() {
		return this.password;
	}
	
	private void setStatus(boolean status) {
		this.status = status;
	}
	
	public boolean getStatus() {
		return this.status;
	}
	
	public void logout() {
		setStatus(false);
	}
	public void login() {
		setStatus(true);
	}
}